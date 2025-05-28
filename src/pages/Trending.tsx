
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { gamesData } from '@/data/gamesData';
import { miniGames } from '@/data/gamesCollection';
import GameCard from '@/components/GameCard';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Clock, TrendingUp, Star, Gamepad } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Game components
import SnakeGame from '@/components/games/SnakeGame';
import FlappyBirdGame from '@/components/games/FlappyBirdGame';
import TicTacToeGame from '@/components/games/TicTacToeGame';
import MemoryMatchGame from '@/components/games/MemoryMatchGame';
import Game2048 from '@/components/games/Game2048';
import PongGame from '@/components/games/PongGame';
import BrickBreakerGame from '@/components/games/BrickBreakerGame';
import TetrisGame from '@/components/games/TetrisGame';

const Trending = () => {
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Simulate different game lists
  const trendingGames = [...gamesData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 15);
  
  const newGames = [...gamesData]
    .sort((a, b) => b.releaseYear - a.releaseYear)
    .slice(0, 15);
  
  const popularGames = [...gamesData]
    .sort(() => Math.random() - 0.5)
    .slice(0, 15);

  // Add arcade games to trending
  const trendingArcadeGames = miniGames.filter(game => game.isActive).slice(0, 10);
    
  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayArcadeGame = (game: any) => {
    setSelectedGame(game);
    setIsGameModalOpen(true);
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
    setSelectedGame(null);
  };

  const renderGameComponent = () => {
    if (!selectedGame) return null;

    switch (selectedGame.id) {
      case 'snake':
        return <SnakeGame onClose={closeGameModal} />;
      case 'flappy-bird':
        return <FlappyBirdGame onClose={closeGameModal} />;
      case 'tic-tac-toe':
        return <TicTacToeGame onClose={closeGameModal} />;
      case 'memory-match':
        return <MemoryMatchGame onClose={closeGameModal} />;
      case '2048':
        return <Game2048 onClose={closeGameModal} />;
      case 'pong':
        return <PongGame onClose={closeGameModal} />;
      case 'brick-breaker':
        return <BrickBreakerGame onClose={closeGameModal} />;
      case 'tetris':
        return <TetrisGame onClose={closeGameModal} />;
      default:
        return (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Game coming soon!</p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-12 px-4 md:px-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Trending Games</h1>
          <p className="text-muted-foreground">Discover what's popular right now</p>
        </div>
        
        <Tabs defaultValue="trending" className="mb-8">
          <TabsList className="mb-6 flex-wrap h-auto p-1">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="arcade" className="flex items-center gap-2">
              <Gamepad className="h-4 w-4" />
              Arcade
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="new">New Releases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(15)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
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

          <TabsContent value="arcade">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-2">Play Instantly</h2>
                  <p className="text-muted-foreground text-sm">Click any game to start playing immediately</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {trendingArcadeGames.map((game, index) => (
                    <Card key={game.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                      <div className="relative">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Button
                          size="sm"
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-unigames-purple hover:bg-unigames-purple/80"
                          onClick={() => handlePlayArcadeGame(game)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Now
                        </Button>
                        {index < 3 && (
                          <Badge className="absolute top-2 right-2 z-20 bg-red-500">
                            HOT
                          </Badge>
                        )}
                      </div>
                      <CardHeader className="pb-2 p-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-sm md:text-base line-clamp-1">{game.title}</CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {game.difficulty}
                          </Badge>
                        </div>
                        <CardDescription className="text-xs md:text-sm line-clamp-2">
                          {game.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0 p-3">
                        <div className="flex justify-between items-center text-xs md:text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {game.playTime}
                          </div>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {game.category}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="popular">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(15)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {popularGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="new">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(15)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
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

        {/* Call to Action */}
        <div className="text-center mt-12 py-8 bg-gradient-to-r from-unigames-purple/10 to-unigames-blue/10 rounded-lg">
          <h3 className="text-xl font-bold mb-2">Want to see more games?</h3>
          <p className="text-muted-foreground mb-4">Explore our full collection of games</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/games')} className="bg-unigames-purple hover:bg-unigames-purple/80">
              <Gamepad className="h-4 w-4 mr-2" />
              Arcade Games
            </Button>
            <Button onClick={() => navigate('/browse')} variant="outline">
              Browse All Games
            </Button>
          </div>
        </div>
      </div>

      {/* Game Modal */}
      <Dialog open={isGameModalOpen} onOpenChange={setIsGameModalOpen}>
        <DialogContent className="max-w-6xl h-[90vh] p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold">
              {selectedGame?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {renderGameComponent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Trending;
