
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Play, Clock, Star, Gamepad2, X, Search, Filter, Trophy, Zap, Users, Crown, Heart, Share } from 'lucide-react';
import { workingGames, WorkingGame } from '@/data/workingGamesData';

// Game components
import SnakeGame from '@/components/games/SnakeGame';
import FlappyBirdGame from '@/components/games/FlappyBirdGame';
import TicTacToeGame from '@/components/games/TicTacToeGame';
import MemoryMatchGame from '@/components/games/MemoryMatchGame';
import Game2048 from '@/components/games/Game2048';
import PongGame from '@/components/games/PongGame';
import BrickBreakerGame from '@/components/games/BrickBreakerGame';
import TetrisGame from '@/components/games/TetrisGame';

interface GameStats {
  plays: number;
  rating: number;
  difficulty: string;
  isFavorite: boolean;
}

const EnhancedWorkingGamesSection = () => {
  const [selectedGame, setSelectedGame] = useState<WorkingGame | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [gameStats, setGameStats] = useState<Record<string, GameStats>>({});
  const [favorites, setFavorites] = useState<string[]>([]);

  // Initialize game stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('gameStats');
    const savedFavorites = localStorage.getItem('gameFavorites');
    
    if (savedStats) {
      setGameStats(JSON.parse(savedStats));
    }
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

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

  // Sort games by popularity (play count)
  const sortedGames = [...filteredGames].sort((a, b) => {
    const statsA = gameStats[a.id] || { plays: 0, rating: 4.5, difficulty: a.difficulty, isFavorite: false };
    const statsB = gameStats[b.id] || { plays: 0, rating: 4.5, difficulty: b.difficulty, isFavorite: false };
    return statsB.plays - statsA.plays;
  });

  const handlePlayGame = (game: WorkingGame) => {
    // Update play count
    const currentStats = gameStats[game.id] || { plays: 0, rating: 4.5, difficulty: game.difficulty, isFavorite: false };
    const updatedStats = {
      ...gameStats,
      [game.id]: { ...currentStats, plays: currentStats.plays + 1 }
    };
    setGameStats(updatedStats);
    localStorage.setItem('gameStats', JSON.stringify(updatedStats));

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
      // Fallback for browsers without Web Share API
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

  const getFavoriteGames = () => sortedGames.filter(game => favorites.includes(game.id));
  const getTrendingGames = () => sortedGames.slice(0, 4);

  return (
    <section className="py-8 md:py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 backdrop-blur-sm border border-unigames-purple/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Zap className="w-4 h-4 text-unigames-purple animate-pulse" />
            <span>Instant Play • No Downloads • {workingGames.length} Games</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
              Play Instantly
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Premium browser games with achievements, leaderboards, and social features!
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="capitalize"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Game Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              All Games ({sortedGames.length})
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites ({getFavoriteGames().length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedGames.map((game) => {
                const stats = gameStats[game.id] || { plays: 0, rating: 4.8, difficulty: game.difficulty, isFavorite: false };
                return (
                  <Card 
                    key={game.id} 
                    className="group hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-unigames-purple/30 h-full flex flex-col bg-gradient-to-b from-card to-card/90"
                    onClick={() => handlePlayGame(game)}
                  >
                    {/* Enhanced Game Thumbnail */}
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      {/* Enhanced Status Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-1">
                        <Badge className="bg-green-500 hover:bg-green-500 text-white shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
                          LIVE
                        </Badge>
                        {stats.plays > 50 && (
                          <Badge className="bg-orange-500 hover:bg-orange-500 text-white shadow-lg">
                            🔥 HOT
                          </Badge>
                        )}
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

                      {/* Enhanced Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white shadow-2xl transform hover:scale-105 transition-all duration-300"
                        >
                          <Play className="h-5 w-5 mr-2" />
                          Play Now
                        </Button>
                      </div>

                      {/* Play Count */}
                      {stats.plays > 0 && (
                        <div className="absolute bottom-3 left-3">
                          <Badge variant="outline" className="bg-black/50 text-white border-white/30">
                            <Users className="h-3 w-3 mr-1" />
                            {stats.plays} plays
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Game Info */}
                    <CardHeader className="pb-2 flex-shrink-0">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg line-clamp-1 group-hover:text-unigames-purple transition-colors">
                          {game.title}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star className="h-4 w-4 fill-current" />
                          <span className="text-sm font-medium">{stats.rating}</span>
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
                          <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                            Mobile Ready
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                            HD Graphics
                          </Badge>
                        </div>
                      </div>
                      
                      {/* Enhanced Action Button */}
                      <Button 
                        className="w-full bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105"
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
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {getTrendingGames().map((game, index) => (
                <Card key={game.id} className="relative overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div className="absolute top-2 left-2 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                      #{index + 1} Trending
                    </Badge>
                  </div>
                  {/* Use same card content structure as above but simplified */}
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{game.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{game.description}</p>
                    <Button className="w-full" onClick={() => handlePlayGame(game)}>
                      <Play className="h-4 w-4 mr-2" />
                      Play Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            {getFavoriteGames().length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Favorites Yet</h3>
                <p className="text-muted-foreground">Click the heart icon on games to add them to your favorites!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {getFavoriteGames().map((game) => (
                  <Card key={game.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{game.title}</h3>
                      <Button className="w-full" onClick={() => handlePlayGame(game)}>
                        <Play className="h-4 w-4 mr-2" />
                        Play Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Enhanced Stats and Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-3 text-green-500" />
              <h3 className="font-bold text-xl mb-2">Achievement System</h3>
              <p className="text-sm text-muted-foreground">Unlock badges and track your gaming progress</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-blue-500" />
              <h3 className="font-bold text-xl mb-2">Social Gaming</h3>
              <p className="text-sm text-muted-foreground">Share scores and compete with friends</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 mx-auto mb-3 text-purple-500" />
              <h3 className="font-bold text-xl mb-2">Instant Play</h3>
              <p className="text-sm text-muted-foreground">No downloads, no waiting - play immediately</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Game Modal */}
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
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(selectedGame.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => shareGame(selectedGame, e)}
                    >
                      <Share className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button variant="ghost" size="icon" onClick={closeGameModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
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

export default EnhancedWorkingGamesSection;
