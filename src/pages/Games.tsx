
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Clock, Star, Filter } from "lucide-react";
import { miniGames, MiniGame } from '@/data/gamesCollection';
import Navbar from '@/components/Navbar';
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

  const categories = ['all', 'arcade', 'puzzle', 'strategy', 'action', 'sports', 'racing'];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                Game Arcade
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Play classic games instantly in your browser. No downloads, no signup required!
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-8 flex-wrap justify-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Category:</span>
            </div>
            {categories.map((category) => (
              <Button
                key={category}
                variant={categoryFilter === category ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Active Games */}
          {activeGames.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                Play Now ({activeGames.length} Games)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {activeGames.map((game) => (
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
                        onClick={() => handlePlayGame(game)}
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

          {/* Coming Soon Games */}
          {comingSoonGames.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-muted-foreground">
                Coming Soon
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {comingSoonGames.map((game) => (
                  <Card key={game.id} className="opacity-60 relative overflow-hidden">
                    <div className="relative">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-32 sm:h-40 md:h-48 object-cover grayscale"
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

export default Games;
