
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Play, Search, Filter, Star, Trophy, Users, Heart, Share, X } from 'lucide-react';
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

export const EnhancedGamesPage = () => {
  const [selectedGame, setSelectedGame] = useState<WorkingGame | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState<string[]>([]);

  // Get unique categories
  const categories = ['all', ...new Set(workingGames.map(game => game.category.toLowerCase()))];

  // Filter games based on search and category
  const filteredGames = workingGames.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           game.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const savedFavorites = localStorage.getItem('gameFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Listen for game modal events from other components
  useEffect(() => {
    const handleOpenGameModal = (event: CustomEvent) => {
      const gameData = event.detail;
      const game = workingGames.find(g => g.id === gameData.id || g.id === gameData.gameId);
      if (game) {
        handlePlayGame(game);
      }
    };

    window.addEventListener('openGameModal', handleOpenGameModal as EventListener);
    window.addEventListener('playGame', handleOpenGameModal as EventListener);
    
    return () => {
      window.removeEventListener('openGameModal', handleOpenGameModal as EventListener);
      window.removeEventListener('playGame', handleOpenGameModal as EventListener);
    };
  }, []);

  const handlePlayGame = (game: WorkingGame) => {
    setSelectedGame(game);
    setIsGameModalOpen(true);
  };

  const toggleFavorite = (gameId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFavorites = favorites.includes(gameId)
      ? favorites.filter(id => id !== gameId)
      : [...favorites, gameId];
    
    setFavorites(newFavorites);
    localStorage.setItem('gameFavorites', JSON.stringify(newFavorites));
  };

  const shareGame = (game: WorkingGame, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Play ${game.title}`,
        text: game.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Check out ${game.title}: ${window.location.href}`);
    }
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
    setSelectedGame(null);
  };

  const renderGameComponent = () => {
    if (!selectedGame) return null;

    const gameComponents: { [key: string]: JSX.Element } = {
      'bubble-bop': <BubbleBopGame onClose={closeGameModal} />,
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
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{selectedGame.title}</h3>
          <p className="text-muted-foreground mb-4">Game is loading...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Enhanced Header */}
      <div className="text-center mb-8 md:mb-12 pt-8">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 backdrop-blur-sm border border-unigames-purple/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
          <Trophy className="w-4 h-4 text-unigames-purple animate-pulse" />
          <span>Premium Games • {workingGames.length} Available • HD Quality</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
            Game Collection
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Play premium browser games instantly with achievements, leaderboards, and social features!
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 px-4 md:px-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card border-border"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`capitalize transition-all duration-200 ${
                selectedCategory === category 
                  ? "bg-unigames-purple text-white hover:bg-unigames-purple/80" 
                  : "hover:bg-unigames-purple/10 hover:text-unigames-purple hover:border-unigames-purple/30"
              }`}
            >
              {category === 'all' ? 'All Games' : category}
            </Button>
          ))}
        </div>
      </div>

      {/* Games Grid */}
      <div className="px-4 md:px-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <Card 
              key={game.id} 
              className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-unigames-purple/30 h-full flex flex-col bg-gradient-to-b from-card to-card/90 hover:scale-105 transform"
              onClick={() => handlePlayGame(game)}
            >
              {/* Game Thumbnail */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 hover:bg-green-500 text-white shadow-lg">
                    <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                    LIVE
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={(e) => toggleFavorite(game.id, e)}
                  >
                    <Heart className={`h-4 w-4 ${favorites.includes(game.id) ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                    onClick={(e) => shareGame(game, e)}
                  >
                    <Share className="h-4 w-4" />
                  </Button>
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    Play Now
                  </Button>
                </div>
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
                    <Users className="h-4 w-4" />
                    <span>{game.playTime}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {game.difficulty}
                  </Badge>
                </div>
                
                {/* Game Category and Features */}
                <div className="space-y-2 mb-3">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {game.category}
                  </Badge>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-300">
                      Mobile Ready
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300">
                      HD Graphics
                    </Badge>
                  </div>
                </div>
                
                {/* Action Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 transition-all duration-300 group-hover:shadow-lg"
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

        {/* No Results */}
        {filteredGames.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-2xl font-bold mb-2">No games found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or filter criteria
            </p>
            <Button onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}>
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Game Modal */}
      <Dialog open={isGameModalOpen} onOpenChange={setIsGameModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] p-0 overflow-hidden bg-background border-border">
          <DialogHeader className="p-4 md:p-6 pb-0 flex-shrink-0 border-b border-border">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                {selectedGame?.title}
                <Badge className="bg-green-500 hover:bg-green-500">
                  <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                  LIVE
                </Badge>
              </DialogTitle>
              <div className="flex items-center gap-2">
                {selectedGame && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(selectedGame.id, e);
                      }}
                      className="hover:bg-muted"
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(selectedGame.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => shareGame(selectedGame, e)}
                      className="hover:bg-muted"
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" onClick={closeGameModal} className="hover:bg-muted">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden bg-black">
            {renderGameComponent()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedGamesPage;
