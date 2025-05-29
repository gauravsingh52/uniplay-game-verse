import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Clock, Star, Gamepad2, X } from "lucide-react";
import { workingGames, WorkingGame } from '@/data/workingGamesData';

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
import ZooZoomGame from '@/components/games/ZooZoomGame';
import JellyStackGame from '@/components/games/JellyStackGame';
import SnailSprintGame from '@/components/games/SnailSprintGame';
import PlantPanicGame from '@/components/games/PlantPanicGame';

const WorkingGamesSection = () => {
  const [selectedGame, setSelectedGame] = useState<WorkingGame | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  const handlePlayGame = (game: WorkingGame) => {
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
      'toast-escape': <ToastEscapeGame onClose={closeGameModal} />,
      'flap-n-nap': <FlapNapGame onClose={closeGameModal} />,
      'pixel-jumper': <PixelJumperGame onClose={closeGameModal} />,
      'cloud-hop': <CloudHopGame onClose={closeGameModal} />,
      'color-rush': <ColorRushGame onClose={closeGameModal} />,
      'zoo-zoom': <ZooZoomGame onClose={closeGameModal} />,
      'jelly-stack': <JellyStackGame onClose={closeGameModal} />,
      'snail-sprint': <SnailSprintGame onClose={closeGameModal} />,
      'plant-panic': <PlantPanicGame onClose={closeGameModal} />,
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
          <p className="text-muted-foreground mb-4">Game not available</p>
        </div>
      </div>
    );
  };

  return (
    <section className="py-8 md:py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 backdrop-blur-sm border border-unigames-purple/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Gamepad2 className="w-4 h-4 text-unigames-purple" />
            <span>100% Working Games</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
              Play Instantly
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real, working browser games ready to play. No downloads, no signups, just pure gaming fun!
          </p>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {workingGames.map((game) => (
            <Card 
              key={game.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-unigames-purple/30 h-full flex flex-col"
              onClick={() => handlePlayGame(game)}
            >
              {/* Game Thumbnail */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white shadow-lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Play Now
                  </Button>
                </div>

                {/* Status Badge */}
                <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-500">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </Badge>

                {/* Difficulty Badge */}
                <Badge 
                  variant="outline" 
                  className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm"
                >
                  {game.difficulty}
                </Badge>
              </div>
              
              {/* Game Info */}
              <CardHeader className="pb-2 flex-shrink-0">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1 group-hover:text-unigames-purple transition-colors">
                    {game.title}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">4.8</span>
                  </div>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {game.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0 flex-grow flex flex-col justify-end">
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {game.playTime}
                  </div>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {game.category}
                  </Badge>
                </div>
                
                {/* Action Button */}
                <Button 
                  className="w-full bg-unigames-purple hover:bg-unigames-purple/80 transition-all duration-300 group-hover:shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayGame(game);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Play Game
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 py-8 bg-gradient-to-r from-unigames-purple/10 to-unigames-blue/10 rounded-xl border border-unigames-purple/20">
          <h3 className="text-xl md:text-2xl font-bold mb-3">More Games Coming Soon!</h3>
          <p className="text-muted-foreground mb-4 max-w-md mx-auto">
            We're constantly adding new games. Bookmark this page to never miss a new release!
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline">No Downloads</Badge>
            <Badge variant="outline">Instant Play</Badge>
            <Badge variant="outline">Mobile Friendly</Badge>
            <Badge variant="outline">100% Free</Badge>
          </div>
        </div>
      </div>

      {/* Game Modal */}
      <Dialog open={isGameModalOpen} onOpenChange={setIsGameModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 md:p-6 pb-0 flex-shrink-0">
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
    </section>
  );
};

export default WorkingGamesSection;
