
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Gamepad2, Star, Play } from 'lucide-react';
import { workingGames } from '@/data/workingGamesData';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  rating?: number;
}

interface EnhancedSearchBarProps {
  onClose?: () => void;
  placeholder?: string;
  className?: string;
}

const EnhancedSearchBar = ({ onClose, placeholder = "Search games...", className }: EnhancedSearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Convert working games to search results
  const searchableGames: SearchResult[] = workingGames.map(game => ({
    id: game.id,
    title: game.title,
    description: game.description,
    category: game.category,
    thumbnail: game.thumbnail,
    rating: 4.5 // Default rating for all games
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length > 0) {
      const filtered = searchableGames.filter(game => 
        game.title.toLowerCase().includes(query.toLowerCase()) ||
        game.description.toLowerCase().includes(query.toLowerCase()) ||
        game.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8); // Limit to 8 results
      
      setResults(filtered);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleGameSelect(results[selectedIndex]);
        } else if (results.length > 0) {
          handleGameSelect(results[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleGameSelect = (game: SearchResult) => {
    setQuery('');
    setIsOpen(false);
    onClose?.();
    
    // Trigger game modal opening
    const event = new CustomEvent('openGameModal', { detail: game });
    window.dispatchEvent(event);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const categories = [...new Set(searchableGames.map(game => game.category))];

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className="pl-10 pr-10"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 max-h-96 overflow-hidden border shadow-lg">
          {results.length > 0 ? (
            <CardContent className="p-0">
              <div className="max-h-80 overflow-y-auto">
                {results.map((game, index) => (
                  <div
                    key={game.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                      index === selectedIndex ? 'bg-muted' : ''
                    } ${index < results.length - 1 ? 'border-b border-border/50' : ''}`}
                    onClick={() => handleGameSelect(game)}
                  >
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{game.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {game.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {game.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-muted-foreground">
                            {game.rating?.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Play className="h-4 w-4 text-unigames-purple flex-shrink-0" />
                  </div>
                ))}
              </div>
            </CardContent>
          ) : query.length > 0 ? (
            <CardContent className="p-4 text-center">
              <Gamepad2 className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">No games found for "{query}"</p>
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Try searching for:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {categories.slice(0, 4).map(category => (
                    <Badge 
                      key={category} 
                      variant="outline" 
                      className="text-xs cursor-pointer hover:bg-unigames-purple/10"
                      onClick={() => setQuery(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          ) : null}
        </Card>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
