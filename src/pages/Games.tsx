
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Clock, Star, Filter, Eye, Volume2, Gamepad2 } from "lucide-react";
import { miniGames, MiniGame } from '@/data/gamesCollection';
import Navbar from '@/components/Navbar';
import GameVideoPreview from '@/components/GameVideoPreview';
import GameFeatures from '@/components/GameFeatures';
import SnakeGame from '@/components/games/SnakeGame';
import FlappyBirdGame from '@/components/games/FlappyBirdGame';
import TicTacToeGame from '@/components/games/TicTacToeGame';
import MemoryMatchGame from '@/components/games/MemoryMatchGame';
import Game2048 from '@/components/games/Game2048';
import PongGame from '@/components/games/PongGame';
import BrickBreakerGame from '@/components/games/BrickBreakerGame';
import TetrisGame from '@/components/games/TetrisGame';

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState<string | null>(null);

  const filteredGames = miniGames.filter(game => 
    categoryFilter === 'all' || game.category === categoryFilter
  );

  const activeGames = filteredGames.filter(game => game.isActive);
  const comingSoonGames = filteredGames.filter(game => !game.isActive);

  const handlePlayGame = (game: MiniGame) => {
    if (!game.isActive) return;
    setSelectedGame(game);
    setIsGameModalOpen(true);
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
    setSelectedGame(null);
  };

  const renderGameComponent = () => {
    if (!selectedGame) return null;

    // Game component mapping
    const gameComponents: { [key: string]: JSX.Element } = {
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
        <Gamepad2 className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{selectedGame.title}</h3>
          <p className="text-muted-foreground mb-4">Coming Soon!</p>
          <p className="text-sm text-muted-foreground max-w-md">
            This game is currently in development. Check back soon for the full gaming experience!
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline">In Development</Badge>
          <Badge variant="secondary">{selectedGame.category}</Badge>
        </div>
      </div>
    );
  };

  const categories = ['all', 'arcade', 'puzzle', 'strategy', 'action', 'sports', 'racing', 'adventure', 'casual'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-16 px-2 sm:px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                Game Arcade
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
              Play {miniGames.length}+ games instantly in your browser. No downloads, no signup required!
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 md:gap-4 mb-6 md:mb-8 flex-wrap justify-center px-2">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium hidden sm:inline">Category:</span>
            </div>
            <div className="flex flex-wrap gap-1 md:gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={categoryFilter === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCategoryFilter(category)}
                  className="capitalize text-xs md:text-sm h-7 md:h-8 px-2 md:px-3"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Active Games */}
          {activeGames.length > 0 && (
            <div className="mb-8 md:mb-12">
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 flex items-center gap-2 px-2">
                <Star className="h-5 md:h-6 w-5 md:w-6 text-yellow-500" />
                Play Now ({activeGames.length} Games)
              </h2>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                {activeGames.map((game) => (
                  <Card key={game.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                    <div className="relative">
                      {/* Game Thumbnail */}
                      <div className="relative h-32 sm:h-36 md:h-48 overflow-hidden">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        {/* Video Preview Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 hover:bg-black/70 text-white h-7 w-7 p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowVideoPreview(game.id);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        
                        {/* Play Button */}
                        <Button
                          size="sm"
                          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-unigames-purple hover:bg-unigames-purple/80 h-8 md:h-10 px-3 md:px-4"
                          onClick={() => handlePlayGame(game)}
                        >
                          <Play className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2" />
                          <span className="text-xs md:text-sm">Play</span>
                        </Button>
                        
                        {/* Unique Features Badge */}
                        {game.uniqueFeatures && game.uniqueFeatures.length > 0 && (
                          <Badge className="absolute bottom-2 left-2 bg-gradient-to-r from-unigames-purple to-unigames-blue text-white text-xs">
                            <Star className="h-2 w-2 mr-1" />
                            Exclusive
                          </Badge>
                        )}
                      </div>
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
                      
                      {/* Unique Features Preview */}
                      {game.uniqueFeatures && game.uniqueFeatures.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {game.uniqueFeatures.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-unigames-purple/10 text-unigames-purple border-unigames-purple/30">
                              {feature}
                            </Badge>
                          ))}
                          {game.uniqueFeatures.length > 2 && (
                            <span className="text-xs text-muted-foreground">+{game.uniqueFeatures.length - 2} more</span>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Coming Soon Games */}
          {comingSoonGames.length > 0 && (
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-muted-foreground px-2">
                Coming Soon ({comingSoonGames.length} Games)
              </h2>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
                {comingSoonGames.map((game) => (
                  <Card key={game.id} className="opacity-60 relative overflow-hidden">
                    <div className="relative">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-32 sm:h-36 md:h-48 object-cover grayscale"
                      />
                      <div className="absolute inset-0 bg-black/40" />
                      <Badge className="absolute top-4 left-4 bg-orange-500">
                        Coming Soon
                      </Badge>
                    </div>
                    <CardHeader className="pb-2 p-3">
                      <CardTitle className="text-sm md:text-base">{game.title}</CardTitle>
                      <CardDescription className="text-xs md:text-sm">
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
        </div>
      </div>

      {/* Game Modal */}
      <Dialog open={isGameModalOpen} onOpenChange={setIsGameModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 md:p-6 pb-0">
            <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
              {selectedGame?.title}
              {selectedGame?.uniqueFeatures && selectedGame.uniqueFeatures.length > 0 && (
                <Badge className="bg-gradient-to-r from-unigames-purple to-unigames-blue text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Enhanced
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {renderGameComponent()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Preview Modal */}
      <Dialog open={!!showVideoPreview} onOpenChange={() => setShowVideoPreview(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Game Preview</DialogTitle>
          </DialogHeader>
          {showVideoPreview && (
            <div className="space-y-4">
              <GameVideoPreview
                videoUrl={miniGames.find(g => g.id === showVideoPreview)?.videoUrl || ''}
                title={miniGames.find(g => g.id === showVideoPreview)?.title || ''}
                className="h-64 md:h-96"
              />
              <GameFeatures
                features={['High-quality graphics', 'Smooth gameplay', 'Mobile optimized']}
                uniqueFeatures={miniGames.find(g => g.id === showVideoPreview)?.uniqueFeatures}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Games;
