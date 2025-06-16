
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Clock, TrendingUp, Gamepad2 } from "lucide-react";
import { useSearch } from '@/hooks/useSearch';

interface EnhancedSearchBarProps {
  onClose?: () => void;
  fullWidth?: boolean;
  showRecentSearches?: boolean;
}

const EnhancedSearchBar = ({ onClose, fullWidth = false, showRecentSearches = true }: EnhancedSearchBarProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { searchTerm, setSearchTerm, searchResults, isSearching, highlightMatch } = useSearch();

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (term?: string) => {
    const searchQuery = term || searchTerm;
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      if (onClose) onClose();
    }
  };

  const handleResultClick = (result: any) => {
    saveRecentSearch(searchTerm);
    
    if (result.type === 'game') {
      navigate(`/game/${result.id}`);
    } else if (result.type === 'category') {
      navigate(`/category/${result.category[0]}`);
    }
    
    setSearchTerm('');
    if (onClose) onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      if (onClose) onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`} ref={searchRef}>
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search games, categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          className="pl-12 pr-10 py-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-xl focus:border-unigames-purple focus:ring-2 focus:ring-unigames-purple/20 transition-all duration-300"
          autoFocus
        />
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-unigames-purple transition-colors" 
          onClick={() => handleSearch()}
        >
          <Search className="h-5 w-5" />
        </button>
        {(searchTerm || onClose) && (
          <button 
            onClick={() => {
              setSearchTerm('');
              if (onClose) onClose();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {isFocused && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-lg border border-border/50 shadow-2xl z-50 max-h-96 overflow-y-auto animate-fadeIn">
          <CardContent className="p-0">
            {/* Search Results */}
            {searchTerm && searchResults.length > 0 && (
              <div className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-unigames-purple" />
                  <span className="text-sm font-medium">Search Results</span>
                  {isSearching && (
                    <div className="w-4 h-4 border-2 border-unigames-purple border-t-transparent rounded-full animate-spin"></div>
                  )}
                </div>
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <div 
                      key={result.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors group"
                      onClick={() => handleResultClick(result)}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        {result.type === 'game' ? (
                          <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Gamepad2 className="h-6 w-6 text-unigames-purple" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-medium truncate group-hover:text-unigames-purple transition-colors" 
                          dangerouslySetInnerHTML={{ __html: highlightMatch(result.title, searchTerm) }}
                        />
                        <div 
                          className="text-sm text-muted-foreground truncate" 
                          dangerouslySetInnerHTML={{ __html: highlightMatch(result.description, searchTerm) }}
                        />
                      </div>
                      <Badge variant="secondary" className="flex-shrink-0">
                        {result.type === 'game' ? result.category[0] : 'Category'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {searchTerm && searchResults.length === 0 && !isSearching && (
              <div className="p-6 text-center">
                <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
                <p className="text-sm text-muted-foreground/70 mt-1">Try different keywords or browse categories</p>
              </div>
            )}

            {/* Recent Searches */}
            {!searchTerm && showRecentSearches && recentSearches.length > 0 && (
              <div className="p-4 border-t border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Recent Searches</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={clearRecentSearches} className="text-xs">
                    Clear
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="cursor-pointer hover:bg-unigames-purple/20 hover:text-unigames-purple transition-colors"
                      onClick={() => handleSearch(search)}
                    >
                      {search}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            {!searchTerm && (
              <div className="p-4 border-t border-border/50">
                <div className="text-sm font-medium mb-3">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Browse All Games', action: () => navigate('/games') },
                    { label: 'Categories', action: () => navigate('/categories') },
                    { label: 'Trending', action: () => navigate('/trending') },
                    { label: 'Featured', action: () => navigate('/browse') }
                  ].map((item, index) => (
                    <Button 
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="justify-start text-left h-auto py-2 hover:bg-unigames-purple/10 hover:text-unigames-purple"
                      onClick={() => {
                        item.action();
                        if (onClose) onClose();
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedSearchBar;
