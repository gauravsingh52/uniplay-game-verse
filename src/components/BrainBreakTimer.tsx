
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Coffee, Eye, Heart } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface BreakReminder {
  id: string;
  title: string;
  message: string;
  duration: number; // in minutes
  icon: React.ReactNode;
  color: string;
}

const breakReminders: BreakReminder[] = [
  {
    id: 'hydrate',
    title: 'Hydration Break',
    message: 'Time for a sip of water! 💧 Stay hydrated while gaming.',
    duration: 15,
    icon: <Coffee className="h-4 w-4" />,
    color: 'bg-blue-500'
  },
  {
    id: 'eye-rest',
    title: 'Eye Rest',
    message: 'Look away from the screen for 20 seconds. Your eyes will thank you! 👀',
    duration: 20,
    icon: <Eye className="h-4 w-4" />,
    color: 'bg-green-500'
  },
  {
    id: 'stretch',
    title: 'Stretch Break',
    message: 'Time to stretch! Roll your shoulders and wiggle your fingers. 🤸‍♂️',
    duration: 25,
    icon: <Heart className="h-4 w-4" />,
    color: 'bg-red-500'
  },
  {
    id: 'brain-break',
    title: 'Mental Break',
    message: 'Take a deep breath and relax your mind for a moment. 🧘‍♀️',
    duration: 30,
    icon: <Brain className="h-4 w-4" />,
    color: 'bg-purple-500'
  }
];

export function BrainBreakTimer() {
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [currentReminder, setCurrentReminder] = useState<BreakReminder | null>(null);
  const [isBreakActive, setIsBreakActive] = useState(false);
  const [nextBreakIn, setNextBreakIn] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Listen for game start/end events
    const handleGameStart = () => {
      setGameStartTime(Date.now());
      setIsVisible(true);
    };

    const handleGameEnd = () => {
      if (gameStartTime) {
        const sessionTime = Date.now() - gameStartTime;
        setTotalPlayTime(prev => prev + sessionTime);
        setGameStartTime(null);
      }
      setIsVisible(false);
    };

    window.addEventListener('gameStart', handleGameStart);
    window.addEventListener('gameEnd', handleGameEnd);

    return () => {
      window.removeEventListener('gameStart', handleGameStart);
      window.removeEventListener('gameEnd', handleGameEnd);
    };
  }, [gameStartTime]);

  useEffect(() => {
    if (!gameStartTime) return;

    const interval = setInterval(() => {
      const currentSessionTime = Date.now() - gameStartTime;
      const currentTotalTime = totalPlayTime + currentSessionTime;
      const totalMinutes = currentTotalTime / (1000 * 60);

      // Check for break reminders
      const dueReminder = breakReminders.find(reminder => 
        totalMinutes >= reminder.duration && 
        totalMinutes < reminder.duration + 1 && 
        !isBreakActive
      );

      if (dueReminder) {
        showBreakReminder(dueReminder);
      }

      // Calculate next break
      const nextReminder = breakReminders.find(reminder => 
        totalMinutes < reminder.duration
      );
      
      if (nextReminder) {
        setNextBreakIn(nextReminder.duration - totalMinutes);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStartTime, totalPlayTime, isBreakActive]);

  const showBreakReminder = (reminder: BreakReminder) => {
    setCurrentReminder(reminder);
    setIsBreakActive(true);
    
    toast({
      title: reminder.title,
      description: reminder.message,
      duration: 10000,
    });
  };

  const handleTakeBreak = () => {
    setIsBreakActive(false);
    setCurrentReminder(null);
    
    // Pause the current game if possible
    const event = new CustomEvent('pauseGame');
    window.dispatchEvent(event);

    toast({
      title: "Break time! 🌟",
      description: "Game paused. Take your time and come back refreshed!",
    });
  };

  const handleContinueGaming = () => {
    setIsBreakActive(false);
    setCurrentReminder(null);
  };

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCurrentSessionTime = () => {
    if (!gameStartTime) return 0;
    return (Date.now() - gameStartTime) / (1000 * 60);
  };

  if (!isVisible && !isBreakActive) return null;

  return (
    <>
      {/* Gaming Timer Display */}
      {isVisible && !isBreakActive && (
        <div className="fixed top-20 right-4 z-50">
          <Card className="bg-background/95 backdrop-blur-sm border-border/50 shadow-lg">
            <CardContent className="p-3">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>Playing: {formatTime(getCurrentSessionTime())}</span>
                {nextBreakIn > 0 && nextBreakIn <= 5 && (
                  <Badge variant="outline" className="text-xs animate-pulse">
                    Break in {formatTime(nextBreakIn)}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Break Reminder Modal */}
      {isBreakActive && currentReminder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="max-w-md mx-4 bg-background border-2 border-border shadow-2xl">
            <CardContent className="p-6 text-center space-y-4">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${currentReminder.color} text-white mb-4`}>
                {currentReminder.icon}
              </div>
              
              <h2 className="text-xl font-bold">{currentReminder.title}</h2>
              <p className="text-muted-foreground">{currentReminder.message}</p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>You've been playing for {formatTime(getCurrentSessionTime())}</span>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleTakeBreak}
                  className={`flex-1 ${currentReminder.color} hover:opacity-90`}
                >
                  Take Break
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleContinueGaming}
                  className="flex-1"
                >
                  Continue Gaming
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground">
                We care about your health! Take breaks to stay sharp and enjoy gaming longer. 💚
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
