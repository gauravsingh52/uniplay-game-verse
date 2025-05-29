
import { useState, useCallback, useMemo } from 'react';
import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { workingGames, WorkingGame } from '@/data/workingGamesData';
import ResponsiveGameCard from './ResponsiveGameCard';
import UnifiedGameModal from './UnifiedGameModal';

const OptimizedWorkingGamesSection = () => {
  const [selectedGame, setSelectedGame] = useState<WorkingGame | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('gameFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Memoize game stats to avoid recalculation
  const gameStats = useMemo(() => {
    const stats = localStorage.getItem('gameStats');
    return stats ? JSON.parse(stats) : {};
  }, []);

  const handlePlayGame = useCallback((game: WorkingGame) => {
    // Track game start
    const currentStats = gameStats[game.id] || { plays: 0, rating: 4.8 };
    const updatedStats = {
      ...gameStats,
      [game.id]: { ...currentStats, plays: currentStats.plays + 1, lastPlayed: new Date().toISOString() }
    };
    localStorage.setItem('gameStats', JSON.stringify(updatedStats));

    setSelectedGame(game);
    setIsGameModalOpen(true);
  }, [gameStats]);

  const handleFavorite = useCallback((gameId: string) => {
    const newFavorites = favorites.includes(gameId)
      ? favorites.filter(id => id !== gameId)
      : [...favorites, gameId];
    
    setFavorites(newFavorites);
    localStorage.setItem('gameFavorites', JSON.stringify(newFavorites));
  }, [favorites]);

  const handleShare = useCallback((game: WorkingGame) => {
    if (navigator.share) {
      navigator.share({
        title: `Play ${game.title}`,
        text: game.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(`Check out ${game.title}: ${window.location.href}`);
    }
  }, []);

  const closeGameModal = useCallback(() => {
    setIsGameModalOpen(false);
    setSelectedGame(null);
  }, []);

  return (
    <section className="py-8 md:py-12 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 backdrop-blur-sm border border-unigames-purple/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
            <Gamepad2 className="w-4 h-4 text-unigames-purple" />
            <span>{workingGames.length} Working Games</span>
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

        {/* Responsive Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {workingGames.map((game) => (
            <ResponsiveGameCard
              key={game.id}
              game={game}
              onPlay={handlePlayGame}
              onFavorite={handleFavorite}
              onShare={handleShare}
              isFavorite={favorites.includes(game.id)}
              gameStats={gameStats[game.id]}
            />
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

      {/* Unified Game Modal */}
      <UnifiedGameModal
        isOpen={isGameModalOpen}
        onClose={closeGameModal}
        game={selectedGame}
        onFavorite={handleFavorite}
        onShare={handleShare}
        isFavorite={selectedGame ? favorites.includes(selectedGame.id) : false}
      />
    </section>
  );
};

export default OptimizedWorkingGamesSection;
