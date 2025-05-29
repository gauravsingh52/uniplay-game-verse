
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface Bubble {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
  isTarget: boolean;
  velocity: { x: number; y: number };
}

interface BubbleBopGameProps {
  onClose: () => void;
}

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
const GAME_DURATION = 60; // seconds

export default function BubbleBopGame({ onClose }: BubbleBopGameProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameOver'>('playing');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (isSoundEnabled && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Web Audio API not supported');
      }
    }
  }, [isSoundEnabled]);

  // Play sound effect with increasing tempo
  const playSound = useCallback((frequency: number, type: 'pop' | 'wrong' | 'tick') => {
    if (!isSoundEnabled || !audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'pop') {
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * 2, audioContext.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } else if (type === 'wrong') {
      oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.3);
      gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'tick') {
      const tempo = Math.max(0.1, timeLeft / GAME_DURATION);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + tempo * 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + tempo * 0.1);
    }
  }, [isSoundEnabled, timeLeft]);

  // Generate random bubble
  const createBubble = useCallback((): Bubble => {
    const gameArea = gameAreaRef.current;
    if (!gameArea) return {} as Bubble;

    const rect = gameArea.getBoundingClientRect();
    const size = Math.random() * 40 + 30;
    const isTarget = Math.random() < 0.3; // 30% chance to be target color

    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * (rect.width - size),
      y: Math.random() * (rect.height - size),
      color: isTarget ? targetColor : COLORS[Math.floor(Math.random() * COLORS.length)],
      size,
      isTarget,
      velocity: {
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2
      }
    };
  }, [targetColor]);

  // Initialize bubbles
  useEffect(() => {
    const initialBubbles: Bubble[] = [];
    for (let i = 0; i < 8; i++) {
      initialBubbles.push(createBubble());
    }
    setBubbles(initialBubbles);
  }, [createBubble]);

  // Game timer with accelerating tick sound
  useEffect(() => {
    if (gameState !== 'playing') return;

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1;
        
        // Play tick sound that gets faster as time runs out
        if (newTime > 0) {
          playSound(400 + (GAME_DURATION - newTime) * 10, 'tick');
        }
        
        if (newTime <= 0) {
          setGameState('gameOver');
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState, playSound]);

  // Animate bubbles
  useEffect(() => {
    if (gameState !== 'playing') return;

    const animationFrame = setInterval(() => {
      setBubbles(prevBubbles => {
        return prevBubbles.map(bubble => {
          const gameArea = gameAreaRef.current;
          if (!gameArea) return bubble;

          const rect = gameArea.getBoundingClientRect();
          let newX = bubble.x + bubble.velocity.x;
          let newY = bubble.y + bubble.velocity.y;
          let newVelocityX = bubble.velocity.x;
          let newVelocityY = bubble.velocity.y;

          // Bounce off walls
          if (newX <= 0 || newX >= rect.width - bubble.size) {
            newVelocityX = -newVelocityX;
            newX = Math.max(0, Math.min(rect.width - bubble.size, newX));
          }
          if (newY <= 0 || newY >= rect.height - bubble.size) {
            newVelocityY = -newVelocityY;
            newY = Math.max(0, Math.min(rect.height - bubble.size, newY));
          }

          return {
            ...bubble,
            x: newX,
            y: newY,
            velocity: { x: newVelocityX, y: newVelocityY }
          };
        });
      });
    }, 50);

    return () => clearInterval(animationFrame);
  }, [gameState]);

  // Add new bubbles periodically
  useEffect(() => {
    if (gameState !== 'playing') return;

    const bubbleInterval = setInterval(() => {
      setBubbles(prev => {
        if (prev.length < 12) {
          return [...prev, createBubble()];
        }
        return prev;
      });
    }, 2000);

    return () => clearInterval(bubbleInterval);
  }, [gameState, createBubble]);

  // Change target color periodically
  useEffect(() => {
    if (gameState !== 'playing') return;

    const colorInterval = setInterval(() => {
      setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
    }, 8000);

    return () => clearInterval(colorInterval);
  }, [gameState]);

  const handleBubbleClick = (bubble: Bubble) => {
    if (gameState !== 'playing') return;

    if (bubble.color === targetColor) {
      setScore(prev => prev + 10);
      playSound(400 + score * 2, 'pop');
    } else {
      setScore(prev => Math.max(0, prev - 5));
      playSound(200, 'wrong');
    }

    setBubbles(prev => prev.filter(b => b.id !== bubble.id));
  };

  const resetGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
    setTargetColor(COLORS[0]);
    setBubbles([]);
    // Bubbles will be recreated by useEffect
  };

  const togglePause = () => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Bubble Bop</h1>
          <Badge className="bg-white/20 text-white border-white/30">
            Score: {score}
          </Badge>
          <Badge className="bg-white/20 text-white border-white/30">
            Time: {timeLeft}s
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="text-white hover:bg-white/20"
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePause}
            className="text-white hover:bg-white/20"
          >
            {gameState === 'playing' ? '⏸️' : '▶️'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Target Color Display */}
      <div className="flex items-center justify-center p-2 bg-black/20 backdrop-blur-sm">
        <span className="text-white font-semibold mr-2">Pop bubbles of this color:</span>
        <div 
          className="w-8 h-8 rounded-full border-2 border-white shadow-lg animate-pulse"
          style={{ backgroundColor: targetColor }}
        />
      </div>

      {/* Game Area */}
      <div className="flex-1 relative overflow-hidden" ref={gameAreaRef}>
        {gameState === 'playing' && bubbles.map(bubble => (
          <div
            key={bubble.id}
            className="absolute rounded-full cursor-pointer transform transition-transform hover:scale-110 shadow-lg"
            style={{
              left: bubble.x,
              top: bubble.y,
              width: bubble.size,
              height: bubble.size,
              backgroundColor: bubble.color,
              border: bubble.color === targetColor ? '3px solid white' : '2px solid rgba(255,255,255,0.3)',
              boxShadow: bubble.color === targetColor ? '0 0 20px rgba(255,255,255,0.8)' : '0 4px 8px rgba(0,0,0,0.2)'
            }}
            onClick={() => handleBubbleClick(bubble)}
          />
        ))}

        {/* Game State Overlays */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Game Paused</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p>Click the play button to continue</p>
                <Button onClick={togglePause}>Resume Game</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Game Over!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-2xl font-bold text-primary">Final Score: {score}</p>
                <p>Time's up! Great job popping those bubbles!</p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={resetGame} className="gap-2">
                    <RotateCcw className="h-4 w-4" />
                    Play Again
                  </Button>
                  <Button onClick={onClose} variant="outline">
                    Exit Game
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="p-2 bg-black/20 backdrop-blur-sm text-center text-white text-sm">
        Pop bubbles matching the target color! Wrong colors lose points. Music speeds up as time runs out!
      </div>
    </div>
  );
}
