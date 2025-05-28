
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Target, Zap, Crown, Award } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredGames: string[];
  progress: number;
  completed: boolean;
  reward: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

const defaultQuests: Quest[] = [
  {
    id: 'arcade-master',
    title: 'Arcade Master',
    description: 'Master the classic arcade games',
    icon: '🕹️',
    requiredGames: ['snake', 'flappy-bird', 'pong'],
    progress: 0,
    completed: false,
    reward: 'Retro Theme Unlock',
    difficulty: 'Easy'
  },
  {
    id: 'puzzle-genius',
    title: 'Puzzle Genius',
    description: 'Solve challenging puzzles',
    icon: '🧩',
    requiredGames: ['2048', 'memory-match', 'tetris'],
    progress: 0,
    completed: false,
    reward: 'Brain Power Badge',
    difficulty: 'Medium'
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete games in record time',
    icon: '⚡',
    requiredGames: ['snake', 'tetris', 'brick-breaker'],
    progress: 0,
    completed: false,
    reward: 'Lightning Avatar',
    difficulty: 'Hard'
  },
  {
    id: 'completionist',
    title: 'Completionist',
    description: 'Play every available game',
    icon: '🏆',
    requiredGames: ['snake', 'flappy-bird', 'tic-tac-toe', 'memory-match', '2048', 'pong', 'brick-breaker', 'tetris'],
    progress: 0,
    completed: false,
    reward: 'Golden Crown Avatar',
    difficulty: 'Hard'
  }
];

export function QuestSystem() {
  const [quests, setQuests] = useState<Quest[]>(defaultQuests);
  const { toast } = useToast();

  useEffect(() => {
    // Load quest progress from localStorage
    const savedQuests = localStorage.getItem('gameQuests');
    if (savedQuests) {
      setQuests(JSON.parse(savedQuests));
    }

    // Listen for game completion events
    const handleGameComplete = (event: CustomEvent) => {
      const gameId = event.detail.gameId;
      updateQuestProgress(gameId);
    };

    window.addEventListener('gameComplete', handleGameComplete as EventListener);
    return () => window.removeEventListener('gameComplete', handleGameComplete as EventListener);
  }, []);

  const updateQuestProgress = (gameId: string) => {
    setQuests(prevQuests => {
      const updatedQuests = prevQuests.map(quest => {
        if (quest.requiredGames.includes(gameId) && !quest.completed) {
          const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
          const completedGames = quest.requiredGames.filter(game => gameStats[game]?.plays > 0);
          const newProgress = (completedGames.length / quest.requiredGames.length) * 100;
          
          const updatedQuest = { ...quest, progress: newProgress };
          
          if (newProgress === 100 && !quest.completed) {
            updatedQuest.completed = true;
            toast({
              title: "Quest Completed! 🎉",
              description: `${quest.title} - Reward: ${quest.reward}`,
            });
          }
          
          return updatedQuest;
        }
        return quest;
      });
      
      localStorage.setItem('gameQuests', JSON.stringify(updatedQuests));
      return updatedQuests;
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getQuestIcon = (completed: boolean, difficulty: string) => {
    if (completed) return <Crown className="h-5 w-5 text-yellow-500" />;
    switch (difficulty) {
      case 'Easy': return <Target className="h-5 w-5 text-green-500" />;
      case 'Medium': return <Star className="h-5 w-5 text-yellow-500" />;
      case 'Hard': return <Zap className="h-5 w-5 text-red-500" />;
      default: return <Trophy className="h-5 w-5" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/20">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Active Quests
        </CardTitle>
        <CardDescription>
          Complete themed challenges to unlock rewards and achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {quests.map((quest) => (
          <Card key={quest.id} className={`transition-all duration-300 ${quest.completed ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30' : 'hover:shadow-md'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{quest.icon}</div>
                  <div>
                    <h3 className="font-semibold flex items-center gap-2">
                      {quest.title}
                      {getQuestIcon(quest.completed, quest.difficulty)}
                    </h3>
                    <p className="text-sm text-muted-foreground">{quest.description}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge className={getDifficultyColor(quest.difficulty)}>
                    {quest.difficulty}
                  </Badge>
                  {quest.completed && (
                    <Badge className="bg-green-500 hover:bg-green-500">
                      <Award className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress: {Math.round(quest.progress)}%</span>
                  <span>{quest.requiredGames.filter(game => {
                    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
                    return gameStats[game]?.plays > 0;
                  }).length}/{quest.requiredGames.length} games</span>
                </div>
                <Progress value={quest.progress} className="h-2" />
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {quest.requiredGames.map(gameId => {
                    const gameStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
                    const completed = gameStats[gameId]?.plays > 0;
                    return (
                      <Badge key={gameId} variant={completed ? "default" : "outline"} className="text-xs">
                        {gameId.replace('-', ' ')}
                        {completed && " ✓"}
                      </Badge>
                    );
                  })}
                </div>
                
                {quest.completed && (
                  <div className="mt-3 p-3 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium text-sm">Reward: {quest.reward}</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}
