
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { searchGames } from '@/data/gamesData';
import { Button } from './ui/button';

interface SearchBarProps {
  onClose?: () => void;
  fullWidth?: boolean;
}

const SearchBar = ({ onClose, fullWidth = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{id: string, title: string, thumbnail: string}[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      const searchResults = searchGames(value).map(game => ({
        id: game.id,
        title: game.title,
        thumbnail: game.thumbnail
      })).slice(0, 8);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.length > 0) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setResults([]);
      if (onClose) onClose();
    } else if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  };

  const handleResultClick = (id: string) => {
    navigate(`/game/${id}`);
    setQuery('');
    setResults([]);
    if (onClose) onClose();
  };

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    // Small delay to allow click on results
    setTimeout(() => {
      if (!searchRef.current?.contains(document.activeElement)) {
        setIsFocused(false);
      }
    }, 100);
  };

  const handleSearchPage = () => {
    if (query.length > 0) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      if (onClose) onClose();
    }
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`} ref={searchRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="pl-10 pr-10 py-2 bg-background/60 border-muted transition-all duration-300 focus-within:border-unigames-purple"
          autoFocus
        />
        <button 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground" 
          onClick={handleSearchPage}
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
            aria-label="Close search"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
      
      {results.length > 0 && isFocused && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          {results.map(result => (
            <div 
              key={result.id} 
              className="flex items-center p-2 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0"
              onClick={() => handleResultClick(result.id)}
            >
              <div className="w-10 h-10 min-w-[40px] overflow-hidden rounded-md mr-3">
                <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
              </div>
              <span className="truncate">{result.title}</span>
            </div>
          ))}
          {results.length > 0 && (
            <div className="p-2 text-center border-t border-border">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full text-unigames-purple hover:text-unigames-purple/80"
                onClick={handleSearchPage}
              >
                View all results for "{query}"
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
