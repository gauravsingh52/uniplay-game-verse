
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { searchGames } from '@/data/gamesData';

interface SearchBarProps {
  onClose?: () => void;
  fullWidth?: boolean;
}

const SearchBar = ({ onClose, fullWidth = false }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{id: string, title: string}[]>([]);
  const navigate = useNavigate();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 2) {
      const searchResults = searchGames(value).map(game => ({
        id: game.id,
        title: game.title
      }));
      setResults(searchResults);
    } else {
      setResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.length > 0) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      if (onClose) onClose();
    }
  };

  const handleResultClick = (id: string) => {
    navigate(`/game/${id}`);
    setQuery('');
    setResults([]);
    if (onClose) onClose();
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''}`}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className="pl-10 pr-10 py-2 bg-background/60 border-muted"
          autoFocus
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-muted-foreground hover:text-white" />
          </button>
        )}
      </div>
      
      {results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {results.map(result => (
            <div 
              key={result.id} 
              className="p-3 hover:bg-muted cursor-pointer transition-colors border-b border-border last:border-0"
              onClick={() => handleResultClick(result.id)}
            >
              {result.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
