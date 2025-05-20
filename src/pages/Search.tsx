
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import GameCard from '@/components/GameCard';
import { searchGames } from '@/data/gamesData';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon } from 'lucide-react';
import SearchBar from '@/components/SearchBar';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      const results = searchGames(query);
      setGames(results);
      setLoading(false);
    }, 300);
  }, [query]);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-12 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-2">Search Results</h1>
        <p className="text-muted-foreground mb-6">Showing results for "{query}"</p>
        
        <div className="mb-8 max-w-md">
          <SearchBar fullWidth={true} />
        </div>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-muted rounded-lg animate-pulse" style={{height: '260px'}}></div>
            ))}
          </div>
        ) : (
          <>
            {games.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">No games found</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    We couldn't find any games matching your search. Try different keywords or browse our categories.
                  </p>
                </div>
                <Button onClick={() => window.history.back()} variant="outline" className="mr-2">Go Back</Button>
                <Button onClick={() => window.location.href = '/browse'}>Browse All Games</Button>
              </div>
            ) : (
              <>
                <p className="mb-6">Found {games.length} game{games.length !== 1 ? 's' : ''}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
