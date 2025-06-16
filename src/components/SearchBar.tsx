
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, TrendingUp, Gamepad2, Clock } from "lucide-react";
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
          className="pl-12 pr-10 py-3 bg-background/90 backdrop-blur-sm border border-border/50 rounded-xl focus:border-unigames-purple focus:ring-2 focus:ring-unigames-purple/20 transition-all duration-300"
          autoFocus
        />
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-unigames-purple transition-colors" 
          onClick={handleSearchPage}
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
            aria-label="Close search"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
          </button>
        )}
      </div>
      
      {searchResults.length > 0 && isFocused && (
        <Card className="absolute top-full left-0 right-0 mt-3 bg-background/95 backdrop-blur-lg border border-border/50 shadow-2xl z-50 max-h-80">
          <CardContent className="p-0">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-unigames-purple" />
                <span className="text-sm font-medium">Search Results</span>
                {isSearching && (
                  <div className="w-3 h-3 border-2 border-unigames-purple border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                {searchResults.map(result => (
                  <div 
                    key={result.id} 
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer transition-all duration-200 border-b border-border/30 last:border-0 group rounded-lg"
                    onClick={() => handleResultClick(result.id)}
                  >
                    <div className="w-12 h-12 min-w-[48px] overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                      {result.type === 'game' ? (
                        <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                      ) : (
                        <Gamepad2 className="h-6 w-6 text-unigames-purple" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div 
                        className="font-medium truncate group-hover:text-unigames-purple transition-colors text-sm"
                        dangerouslySetInnerHTML={{ __html: highlightMatch(result.title, searchTerm) }}
                      />
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {result.category.join(', ')}
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {result.type === 'game' ? 'Game' : 'Category'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
            
            {searchResults.length > 0 && (
              <div className="p-3 text-center border-t border-border/50 bg-muted/20">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-unigames-purple hover:text-unigames-purple/80 hover:bg-unigames-purple/10 text-sm"
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
