
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Star, Trophy, Gamepad2, ArrowRight, Zap, Users, Clock, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { enhancedGames, getFeaturedGames, EnhancedGame } from '@/data/enhancedGamesData';

// Game components
import EnhancedSnakeGame from '@/components/games/enhanced/EnhancedSnakeGame';
import EnhancedTetrisGame from '@/components/games/enhanced/EnhancedTetrisGame';
import EnhancedPuzzleGame from '@/components/games/enhanced/EnhancedPuzzleGame';
import BubbleBopGame from '@/components/games/BubbleBopGame';
import JellyStackGame from '@/components/games/JellyStackGame';

const Index = () => {
  const navigate = useNavigate();
  const [selectedGame, setSelectedGame] = useState<EnhancedGame | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  
  const featuredGames = getFeaturedGames();

  const handlePlayGame = (game: EnhancedGame) => {
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
      'enhanced-snake': <EnhancedSnakeGame onClose={closeGameModal} />,
      'enhanced-tetris': <EnhancedTetrisGame onClose={closeGameModal} />,
      'enhanced-puzzle': <EnhancedPuzzleGame onClose={closeGameModal} />,
      'bubble-bop': <BubbleBopGame onClose={closeGameModal} />,
      'jelly-stack': <JellyStackGame onClose={closeGameModal} />
    };

    return gameComponents[selectedGame.id] || null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:px-8 bg-gradient-to-br from-unigames-purple/10 via-background to-unigames-blue/10">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 backdrop-blur-sm border border-unigames-purple/30 rounded-full px-4 py-2 text-sm font-medium mb-6">
              <Zap className="w-4 h-4 text-unigames-purple" />
              <span>Enhanced Gaming Experience</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-unigames-purple via-unigames-blue to-unigames-purple bg-clip-text text-transparent">
                Premium Web Games
              </span>
              <br />
              <span className="text-foreground">Ready to Play</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience our collection of {enhancedGames.length} fully-featured, responsive games with advanced controls, sound effects, and smooth gameplay across all devices.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white shadow-lg"
                onClick={() => navigate('/games')}
              >
                <Play className="mr-2 h-5 w-5" />
                Start Playing Now
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/games')}
              >
                Browse All Games
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className="py-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>Featured Games</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                Most Popular
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our top-rated games with enhanced features and premium gameplay experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredGames.map((game) => (
              <Card 
                key={game.id} 
                className="group hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border-2 hover:border-unigames-purple/50 bg-gradient-to-br from-card to-card/90"
                onClick={() => handlePlayGame(game)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <Trophy className="w-3 h-3 mr-1" />
                      FEATURED
                    </Badge>
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white shadow-2xl"
                    >
                      <Play className="h-6 w-6 mr-2" />
                      Play Now
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl font-bold group-hover:text-unigames-purple transition-colors duration-300">
                        {game.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{game.rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {game.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{game.playTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{game.players}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-unigames-purple/10 text-unigames-purple border-unigames-purple/30">
                        {game.difficulty}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate('/games')}
              className="border-unigames-purple/30 hover:bg-unigames-purple/10"
            >
              View All {enhancedGames.length} Games
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-unigames-blue/5 to-unigames-purple/5">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                Why Choose Our Games?
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-unigames-purple/20 hover:border-unigames-purple/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-unigames-purple to-unigames-blue rounded-lg flex items-center justify-center">
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Fully Functional</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Complete games with advanced controls, sound effects, scoring systems, and responsive design
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-unigames-blue/20 hover:border-unigames-blue/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-unigames-blue to-unigames-purple rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Instant Play</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  No downloads required. Games load instantly and work perfectly on desktop and mobile devices
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-unigames-purple/20 hover:border-unigames-purple/40 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-unigames-purple to-unigames-blue rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Polished gameplay experience with smooth animations, intuitive controls, and engaging mechanics
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
    </div>
  );
};

export default Index;
