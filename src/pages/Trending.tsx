
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { gamesData } from '@/data/gamesData';
import GameCard from '@/components/GameCard';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Trending = () => {
  const [loading, setLoading] = useState(true);
  
  // Simulate different game lists
  const trendingGames = [...gamesData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 20);
  
  const newGames = [...gamesData]
    .sort((a, b) => b.releaseYear - a.releaseYear)
    .slice(0, 20);
  
  const popularGames = [...gamesData]
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);
    
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-12 px-4 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Trending Games</h1>
          <p className="text-muted-foreground">Discover what's popular right now</p>
        </div>
        
        <Tabs defaultValue="trending" className="mb-8">
          <TabsList className="mb-6">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="new">New Releases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse" style={{height: '260px'}}></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {trendingGames.map((game, index) => (
                  <div key={game.id} className="relative">
                    {index < 3 && (
                      <Badge className={`absolute top-2 right-2 z-20 ${
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        'bg-amber-700'
                      }`}>
                        #{index + 1}
                      </Badge>
                    )}
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse" style={{height: '260px'}}></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {popularGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="new">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse" style={{height: '260px'}}></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {newGames.map((game, index) => (
                  <div key={game.id} className="relative">
                    {index < 5 && (
                      <Badge className="absolute top-2 left-2 z-20 bg-unigames-purple">
                        NEW
                      </Badge>
                    )}
                    <GameCard game={game} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Trending;
