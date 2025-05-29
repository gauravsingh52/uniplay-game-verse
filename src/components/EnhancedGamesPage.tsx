import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Play, Search, Heart, Filter, Shuffle, Star, 
  TrendingUp, Clock, Gamepad2, Trophy, Zap 
} from "lucide-react";
import { workingGames } from '@/data/workingGamesData';
import { QuestSystem } from './QuestSystem';
import { VoiceCommands } from './VoiceCommands';
import { MoodThemes } from './MoodThemes';
import { DailyGameMix } from './DailyGameMix';
import { BrainBreakTimer } from './BrainBreakTimer';
import { UserProfileSystem } from './UserProfileSystem';

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

export function EnhancedGamesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'recent'>('name');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);

  // Filter and sort games
  const filteredGames = workingGames
    .filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           game.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || game.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'recent':
          const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
          const aTime = gameStats[a.id]?.lastPlayed || 0;
          const bTime = gameStats[b.id]?.lastPlayed || 0;
          return new Date(bTime).getTime() - new Date(aTime).getTime();
        default:
          return 0;
      }
    });

  const categories = ['all', ...new Set(workingGames.map(game => game.category.toLowerCase()))];

  const handlePlayGame = (game: any) => {
    // Track game stats
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    gameStats[game.id] = {
      ...gameStats[game.id],
      plays: (gameStats[game.id]?.plays || 0) + 1,
      lastPlayed: new Date().toISOString()
    };
    localStorage.setItem('gameStats', JSON.stringify(gameStats));

    // Trigger quest progress
    const questEvent = new CustomEvent('gameComplete', { detail: { gameId: game.id } });
    window.dispatchEvent(questEvent);

    // Trigger game start event for timer
    const timerEvent = new CustomEvent('gameStart');
    window.dispatchEvent(timerEvent);

    setSelectedGame(game);
    setIsGameModalOpen(true);
  };

  const closeGameModal = () => {
    // Trigger game end event for timer
    const timerEvent = new CustomEvent('gameEnd');
    window.dispatchEvent(timerEvent);

    setIsGameModalOpen(false);
    setSelectedGame(null);
  };

  const toggleFavorite = (gameId: string) => {
    const newFavorites = favorites.includes(gameId)
      ? favorites.filter(id => id !== gameId)
      : [...favorites, gameId];
    setFavorites(newFavorites);
    localStorage.setItem('gameFavorites', JSON.stringify(newFavorites));
  };

  const getRandomGame = () => {
    const randomIndex = Math.floor(Math.random() * workingGames.length);
    handlePlayGame(workingGames[randomIndex]);
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
        <Gamepad2 className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{selectedGame.title}</h3>
          <p className="text-muted-foreground mb-4">Game ready to play!</p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Voice Commands */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            Game Arcade
          </h1>
          <p className="text-muted-foreground">
            {workingGames.length} working games • Enhanced gaming experience
          </p>
        </div>
        <div className="flex items-center gap-2">
          <VoiceCommands />
          <Button onClick={getRandomGame} variant="outline" className="gap-2">
            <Shuffle className="h-4 w-4" />
            Surprise Me
          </Button>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search games by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 border rounded-md bg-background"
              >
                <option value="name">Sort by Name</option>
                <option value="difficulty">Sort by Difficulty</option>
                <option value="recent">Recently Played</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Games */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Game Mix */}
          <DailyGameMix />

          {/* Games Grid */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              All Games ({filteredGames.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredGames.map((game) => {
                const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
                const stats = gameStats[game.id];
                const isFavorite = favorites.includes(game.id);

                return (
                  <Card key={game.id} className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden">
                    <div className="relative">
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Game Stats Overlay */}
                      {stats && (
                        <div className="absolute top-2 left-2 flex gap-1">
                          {stats.plays > 0 && (
                            <Badge className="bg-blue-500/80 text-white text-xs">
                              {stats.plays} plays
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Favorite Button */}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/50 hover:bg-black/70 text-white h-8 w-8 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(game.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      
                      {/* Play Button */}
                      <Button
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                        onClick={() => handlePlayGame(game)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Play Now
                      </Button>
                    </div>
                    
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base line-clamp-1">{game.title}</CardTitle>
                        <Badge variant="outline">{game.difficulty}</Badge>
                      </div>
                      <CardDescription className="text-sm line-clamp-2">
                        {game.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {game.playTime}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {game.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column - Enhanced Features */}
        <div className="space-y-6">
          {/* User Profile */}
          <UserProfileSystem />
          
          {/* Quest System */}
          <QuestSystem />
          
          {/* Mood Themes */}
          <MoodThemes />
        </div>
      </div>

      {/* Game Modal */}
      <Dialog open={isGameModalOpen} onOpenChange={setIsGameModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] p-0">
          <DialogHeader className="p-4 md:p-6 pb-0">
            <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
              {selectedGame?.title}
              <Badge className="bg-green-500 hover:bg-green-500">
                <Zap className="h-3 w-3 mr-1" />
                Live
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {renderGameComponent()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Brain Break Timer */}
      <BrainBreakTimer />
    </div>
  );
}
