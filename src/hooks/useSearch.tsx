
import { useState, useEffect, useMemo } from 'react';
import { gamesData } from '@/data/gamesData';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string[];
  type: 'game' | 'category';
  matchScore: number;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const normalizeString = (str: string) => {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
};

const calculateMatchScore = (searchTerm: string, text: string) => {
  const normalizedSearch = normalizeString(searchTerm);
  const normalizedText = normalizeString(text);
  
  if (normalizedText.includes(normalizedSearch)) {
    const exactMatch = normalizedText === normalizedSearch ? 100 : 0;
    const startsWith = normalizedText.startsWith(normalizedSearch) ? 50 : 0;
    const includes = normalizedText.includes(normalizedSearch) ? 25 : 0;
    return exactMatch + startsWith + includes;
  }
  
  // Simple typo tolerance
  const words = normalizedSearch.split(' ');
  let score = 0;
  words.forEach(word => {
    if (normalizedText.includes(word)) {
      score += 10;
    }
  });
  
  return score;
};

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm.trim()) return [];

    setIsSearching(true);
    
    const results: SearchResult[] = [];
    const categories = new Set<string>();

    // Search games
    gamesData.forEach(game => {
      const titleScore = calculateMatchScore(debouncedSearchTerm, game.title);
      const descScore = calculateMatchScore(debouncedSearchTerm, game.description);
      const categoryScore = Array.isArray(game.category) 
        ? Math.max(...game.category.map(cat => calculateMatchScore(debouncedSearchTerm, cat)))
        : calculateMatchScore(debouncedSearchTerm, game.category);

      const maxScore = Math.max(titleScore, descScore, categoryScore);
      
      if (maxScore > 0) {
        results.push({
          id: game.id,
          title: game.title,
          description: game.description,
          thumbnail: game.thumbnail,
          category: Array.isArray(game.category) ? game.category : [game.category],
          type: 'game',
          matchScore: maxScore
        });

        // Collect categories
        if (Array.isArray(game.category)) {
          game.category.forEach(cat => categories.add(cat));
        } else {
          categories.add(game.category);
        }
      }
    });

    // Add matching categories
    categories.forEach(category => {
      const score = calculateMatchScore(debouncedSearchTerm, category);
      if (score > 0) {
        results.push({
          id: `category-${category}`,
          title: `${category} Games`,
          description: `Browse all ${category.toLowerCase()} games`,
          thumbnail: '/placeholder.svg',
          category: [category],
          type: 'category',
          matchScore: score
        });
      }
    });

    // Sort by match score
    const sortedResults = results.sort((a, b) => b.matchScore - a.matchScore).slice(0, 8);
    
    setIsSearching(false);
    return sortedResults;
  }, [debouncedSearchTerm]);

  const highlightMatch = (text: string, searchTerm: string) => {
    if (!searchTerm.trim()) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
  };

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isSearching,
    highlightMatch
  };
};
