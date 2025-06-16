
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, TrendingUp, Gamepad2 } from "lucide-react";
import { useSearch } from '@/hooks/useSearch';

interface SearchBarProps {
  onClose?: () => void;
  fullWidth?: boolean;
}

const SearchBar = ({ onClose, fullWidth = false }: SearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { searchTerm, setSearchTerm, searchResults, isSearching, highlightMatch } = useSearch();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchTerm.length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      if (onClose) onClose();
    } else if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  };

  const handleResultClick = (id: string) => {
    navigate(`/game/${id}`);
    setSearchTerm('');
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
    if (searchTerm.length > 0) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
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
          value={searchTerm}
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
      
      {searchResults.length > 0 && isFocused && (
        <Card className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            <div className="p-3">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-unigames-purple" />
                <span className="text-sm font-medium">Search Results</span>
                {isSearching && (
                  <div className="w-3 h-3 border-2 border-unigames-purple border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              {searchResults.map(result => (
                <div 
                  key={result.id} 
                  className="flex items-center p-2 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0 group"
                  onClick={() => handleResultClick(result.id)}
                >
                  <div className="w-10 h-10 min-w-[40px] overflow-hidden rounded-md mr-3">
                    {result.type === 'game' ? (
                      <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <Gamepad2 className="h-5 w-5 text-unigames-purple" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="font-medium truncate group-hover:text-unigames-purple transition-colors"
                      dangerouslySetInnerHTML={{ __html: highlightMatch(result.title, searchTerm) }}
                    />
                    <div className="text-xs text-muted-foreground truncate">
                      {result.category.join(', ')}
                    </div>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {result.type === 'game' ? 'Game' : 'Category'}
                  </Badge>
                </div>
              ))}
            </div>
            {searchResults.length > 0 && (
              <div className="p-2 text-center border-t border-border">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-unigames-purple hover:text-unigames-purple/80"
                  onClick={handleSearchPage}
                >
                  View all results for "{searchTerm}"
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
