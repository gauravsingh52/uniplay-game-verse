import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { gamesData } from '@/data/gamesData';
import { workingGames } from '@/data/workingGamesData';
import GameCard from '@/components/GameCard';
import GameVideoPreview from '@/components/GameVideoPreview';
import GameFeatures from '@/components/GameFeatures';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Clock, TrendingUp, Star, Gamepad, Eye, Volume2, Zap, Users, Trophy, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';

// Game components
import BubbleBopGame from '@/components/games/BubbleBopGame';
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
  const [showVideoPreview, setShowVideoPreview] = useState<string | null>(null);
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

  // Enhanced working games for trending
  const trendingWorkingGames = workingGames
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);
    
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayWorkingGame = (game: any) => {
    setSelectedGame(game);
    setIsGameModalOpen(true);
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
    setSelectedGame(null);
  };

  const renderGameComponent = () => {
    if (!selectedGame) return null;

    const gameComponents: { [key: string]: JSX.Element } = {
      'bubble-bop': <BubbleBopGame onClose={closeGameModal} />,
      'snake': <SnakeGame onClose={closeGameModal} />,
      'flappy-bird': <FlappyBirdGame onClose={closeGameModal} />,
      'tic-tac-toe': <TicTacToeGame onClose={closeGameModal} />,
      'memory-match': <MemoryMatchGame onClose={closeGameModal} />,
      '2048': <Game2048 onClose={closeGameModal} />,
      'pong': <PongGame onClose={closeGameModal} />,
      'brick-breaker': <BrickBreakerGame onClose={closeGameModal} />,
      'tetris': <TetrisGame onClose={closeGameModal} />
    };

    return gameComponents[selectedGame.id] || (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Gamepad className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{selectedGame.title}</h3>
          <p className="text-muted-foreground mb-4">Game ready to play!</p>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-20 pb-12 px-2 sm:px-4 md:px-8 max-w-7xl">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">Trending Games</h1>
          <p className="text-muted-foreground">Discover what's popular right now - {workingGames.length} working games available</p>
        </div>
        
        <Tabs defaultValue="working" className="mb-8">
          <TabsList className="mb-6 flex-wrap h-auto p-1 grid grid-cols-2 lg:grid-cols-4 w-full lg:w-auto">
            <TabsTrigger value="working" className="flex items-center gap-2 text-xs md:text-sm">
              <Gamepad className="h-4 w-4" />
              <span className="hidden sm:inline">Working Games</span>
              <span className="sm:hidden">Play Now</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2 text-xs md:text-sm">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Trending</span>
              <span className="sm:hidden">Hot</span>
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2 text-xs md:text-sm">
              <Star className="h-4 w-4" />
              Popular
            </TabsTrigger>
            <TabsTrigger value="new" className="text-xs md:text-sm">New Releases</TabsTrigger>
          </TabsList>
          
          <TabsContent value="working">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                {[...Array(8)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-2 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-green-500" />
                    100% Working Browser Games
                  </h2>
                  <p className="text-muted-foreground text-sm">Click and play instantly - no downloads required!</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {trendingWorkingGames.map((game, index) => (
                    <Card key={game.id} className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-green-500/30">
                      <div className="relative">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-32 sm:h-40 md:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Working status badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1">
                          <Badge className="bg-green-500 hover:bg-green-500 text-white text-xs">
                            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                            100% WORKING
                          </Badge>
                          {index < 3 && (
                            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs">
                              🔥 TRENDING
                            </Badge>
                          )}
                        </div>
                        
                        <Button
                          size="sm"
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          onClick={() => handlePlayWorkingGame(game)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play Now
                        </Button>
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
                        <div className="flex justify-between items-center text-xs md:text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {game.playTime}
                          </div>
                          <Badge variant="secondary" className="text-xs capitalize">
                            {game.category}
                          </Badge>
                        </div>
                        
                        {/* Working status indicators */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-medium text-green-600">Ready to Play</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              No Download
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Mobile Friendly
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Feature highlights */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
                    <CardContent className="p-4 text-center">
                      <Play className="h-8 w-8 mx-auto mb-2 text-green-500" />
                      <h3 className="font-semibold mb-1">Instant Play</h3>
                      <p className="text-sm text-muted-foreground">Click and play immediately</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                    <CardContent className="p-4 text-center">
                      <Zap className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                      <h3 className="font-semibold mb-1">100% Tested</h3>
                      <p className="text-sm text-muted-foreground">All games verified working</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                    <CardContent className="p-4 text-center">
                      <Trophy className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                      <h3 className="font-semibold mb-1">High Quality</h3>
                      <p className="text-sm text-muted-foreground">Premium gaming experience</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trending">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {[...Array(15)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {[...Array(15)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {popularGames.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="new">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
                {[...Array(15)].map((_, index) => (
                  <div key={index} className="bg-muted rounded-lg animate-pulse h-64"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-6">
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
        <div className="text-center mt-8 md:mt-12 py-6 md:py-8 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
          <h3 className="text-lg md:text-xl font-bold mb-2">Start Playing Now!</h3>
          <p className="text-muted-foreground mb-4">All {workingGames.length} games are tested and ready to play</p>
          <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-center">
            <Button 
              onClick={() => navigate('/games')} 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Play All Games
            </Button>
            <Button onClick={() => navigate('/browse')} variant="outline">
              Browse More Games
            </Button>
          </div>
        </div>
      </div>

      {/* Game Modal */}
      <Dialog open={isGameModalOpen} onOpenChange={setIsGameModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] p-0">
          <DialogHeader className="p-4 md:p-6 pb-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                {selectedGame?.title}
                <Badge className="bg-green-500 hover:bg-green-500">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </Badge>
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={closeGameModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
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
