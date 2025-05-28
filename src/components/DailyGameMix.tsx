
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Shuffle, Play, Star, Gift } from 'lucide-react';
import { workingGames } from '@/data/workingGamesData';

interface DailyMix {
  date: string;
  games: typeof workingGames;
  theme: string;
  bonus: string;
}

const themes = [
  { name: 'Retro Revival', bonus: 'Double XP for classic games' },
  { name: 'Puzzle Paradise', bonus: 'Extra hints in puzzle games' },
  { name: 'Speed Challenge', bonus: 'Time bonuses for quick completion' },
  { name: 'Arcade Fever', bonus: 'Bonus points for high scores' },
  { name: 'Brain Teaser Day', bonus: 'IQ boost rewards available' }
];

export function DailyGameMix() {
  const [dailyMix, setDailyMix] = useState<DailyMix | null>(null);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);

  useEffect(() => {
    generateDailyMix();
    checkTodayProgress();
  }, []);

  const generateDailyMix = () => {
    const today = new Date().toDateString();
    const savedMix = localStorage.getItem('dailyGameMix');
    
    if (savedMix) {
      const parsed = JSON.parse(savedMix);
      if (parsed.date === today) {
        setDailyMix(parsed);
        return;
      }
    }

    // Generate new daily mix
    const shuffledGames = [...workingGames].sort(() => Math.random() - 0.5);
    const selectedGames = shuffledGames.slice(0, 3);
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    const newMix: DailyMix = {
      date: today,
      games: selectedGames,
      theme: randomTheme.name,
      bonus: randomTheme.bonus
    };

    setDailyMix(newMix);
    localStorage.setItem('dailyGameMix', JSON.stringify(newMix));
  };

  const checkTodayProgress = () => {
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem('dailyMixLastPlayed');
    setHasPlayedToday(lastPlayed === today);
  };

  const handlePlayDailyGame = (gameId: string) => {
    const today = new Date().toDateString();
    localStorage.setItem('dailyMixLastPlayed', today);
    setHasPlayedToday(true);

    // Trigger game play event
    const event = new CustomEvent('playGame', { detail: { gameId } });
    window.dispatchEvent(event);
  };

  const getDayProgress = () => {
    if (!dailyMix) return 0;
    
    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
    const playedGames = dailyMix.games.filter(game => {
      const stats = gameStats[game.id];
      const today = new Date().toDateString();
      return stats && stats.lastPlayed === today;
    });
    
    return (playedGames.length / dailyMix.games.length) * 100;
  };

  if (!dailyMix) return null;

  return (
    <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-500" />
          Daily Game Mix
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <Gift className="h-3 w-3 mr-1" />
            Today
          </Badge>
        </CardTitle>
        <CardDescription>
          3 handpicked games refreshed daily • Theme: {dailyMix.theme}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Daily Bonus */}
        <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Daily Bonus: {dailyMix.bonus}</span>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Daily Progress</span>
            <span>{Math.round(getDayProgress())}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
            <div 
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${getDayProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Daily Games */}
        <div className="grid gap-3">
          {dailyMix.games.map((game, index) => {
            const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
            const isPlayedToday = gameStats[game.id]?.lastPlayed === new Date().toDateString();
            
            return (
              <Card key={game.id} className={`transition-all duration-300 ${isPlayedToday ? 'bg-green-500/20 border-green-500/30' : 'hover:shadow-md'}`}>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={game.thumbnail}
                          alt={game.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <Badge className="absolute -top-1 -left-1 h-5 w-5 p-0 bg-orange-500 text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-medium text-sm">{game.title}</h3>
                        <p className="text-xs text-muted-foreground">{game.category} • {game.difficulty}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {isPlayedToday && (
                        <Badge className="bg-green-500 hover:bg-green-500 text-xs">
                          ✓ Played
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handlePlayDailyGame(game.id)}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                      >
                        <Play className="h-3 w-3 mr-1" />
                        Play
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Shuffle Button */}
        <Button
          variant="outline"
          className="w-full"
          onClick={generateDailyMix}
          disabled={hasPlayedToday}
        >
          <Shuffle className="h-4 w-4 mr-2" />
          {hasPlayedToday ? 'New Mix Tomorrow' : 'Shuffle Mix'}
        </Button>

        {getDayProgress() === 100 && (
          <div className="text-center p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/30">
            <h3 className="font-semibold text-green-600 dark:text-green-400">Daily Mix Complete! 🎉</h3>
            <p className="text-sm text-muted-foreground">Come back tomorrow for new games and bonuses</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
