
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Play, Search, Star, Clock, Users, Trophy, Gamepad2, X } from "lucide-react";
import { enhancedGames, getGamesByCategory, searchGames, EnhancedGame } from '@/data/enhancedGamesData';

// Game components
import EnhancedSnakeGame from '@/components/games/enhanced/EnhancedSnakeGame';
import EnhancedTetrisGame from '@/components/games/enhanced/EnhancedTetrisGame';
import EnhancedPuzzleGame from '@/components/games/enhanced/EnhancedPuzzleGame';
import BubbleBopGame from '@/components/games/BubbleBopGame';
import JellyStackGame from '@/components/games/JellyStackGame';

const EnhancedGamesSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGame, setSelectedGame] = useState<EnhancedGame | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  const categories = ['all', 'arcade', 'puzzle', 'classic', 'action', 'physics', 'brain'];

  const filteredGames = searchTerm 
    ? searchGames(searchTerm)
    : getGamesByCategory(selectedCategory);

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

    return gameComponents[selectedGame.id] || (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Gamepad2 className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{selectedGame.title}</h3>
          <p className="text-muted-foreground mb-4">Game loading...</p>
        </div>
      </div>
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-700 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-700 border-gray-500/30';
    }
  };

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 backdrop-blur-sm border border-unigames-purple/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Trophy className="w-4 h-4 text-unigames-purple" />
            <span>Enhanced Games Collection</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
              Play Premium Games
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our collection of fully-featured, responsive games with advanced controls and gameplay
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search games..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category === 'all' ? 'All Games' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Card 
              key={game.id} 
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-unigames-purple/30"
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

                {/* Featured Badge */}
                {game.featured && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                    <Trophy className="w-3 h-3 mr-1" />
                    FEATURED
                  </Badge>
                )}

                {/* Difficulty Badge */}
                <Badge 
                  variant="outline" 
                  className={`absolute top-3 right-3 ${getDifficultyColor(game.difficulty)} backdrop-blur-sm`}
                >
                  {game.difficulty}
                </Badge>
              </div>
              
              {/* Game Info */}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1 group-hover:text-unigames-purple transition-colors">
                    {game.title}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{game.rating}</span>
                  </div>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {game.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {game.playTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {game.players}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {game.category.slice(0, 2).map((cat, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white"
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

        {/* No Games Found */}
        {filteredGames.length === 0 && (
          <div className="text-center py-12">
            <Gamepad2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No games found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </div>
        )}
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

export default EnhancedGamesSection;
