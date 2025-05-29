
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface FlapNapGameProps {
  onClose: () => void;
}

interface Bird {
  y: number;
  velocityY: number;
  isSleeping: boolean;
  sleepTimer: number;
}

interface Pipe {
  x: number;
  gapY: number;
  passed: boolean;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const BIRD_SIZE = 30;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -8;
const PIPE_WIDTH = 60;
const PIPE_GAP = 120;

export default function FlapNapGame({ onClose }: FlapNapGameProps) {
  const [bird, setBird] = useState<Bird>({ y: 200, velocityY: 0, isSleeping: false, sleepTimer: 0 });
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'paused'>('playing');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  // Handle input
  const handleInput = useCallback(() => {
    if (gameState !== 'playing') return;
    
    setBird(prev => {
      if (prev.isSleeping) {
        // Wake up the bird
        return {
          ...prev,
          isSleeping: false,
          sleepTimer: 0,
          velocityY: JUMP_STRENGTH * 0.7 // Weaker jump when waking up
        };
      } else {
        // Normal flap
        return {
          ...prev,
          velocityY: JUMP_STRENGTH
        };
      }
    });
  }, [gameState]);

  // Add event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        handleInput();
      }
    };

    const handleClick = () => handleInput();
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      handleInput();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouch);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouch);
    };
  }, [handleInput]);

  // Initialize pipes
  useEffect(() => {
    const initialPipes: Pipe[] = [];
    for (let i = 0; i < 3; i++) {
      initialPipes.push({
        x: GAME_WIDTH + i * 200,
        gapY: 100 + Math.random() * 200,
        passed: false
      });
    }
    setPipes(initialPipes);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setBird(prev => {
        let newY = prev.y;
        let newVelocityY = prev.velocityY;
        let newIsSleeping = prev.isSleeping;
        let newSleepTimer = prev.sleepTimer;

        // Random sleep check
        if (!prev.isSleeping && Math.random() < 0.002) {
          newIsSleeping = true;
          newSleepTimer = 0;
        }

        // Sleep logic
        if (prev.isSleeping) {
          newSleepTimer += 1;
          // Bird falls faster when sleeping
          newVelocityY += GRAVITY * 2;
          
          // Auto wake up after 2 seconds
          if (newSleepTimer > 120) {
            newIsSleeping = false;
            newSleepTimer = 0;
          }
        } else {
          // Normal gravity
          newVelocityY += GRAVITY;
        }

        newY += newVelocityY;

        // Check boundaries
        if (newY < 0 || newY > GAME_HEIGHT - BIRD_SIZE) {
          setGameState('gameOver');
        }

        return {
          y: newY,
          velocityY: newVelocityY,
          isSleeping: newIsSleeping,
          sleepTimer: newSleepTimer
        };
      });

      // Move pipes
      setPipes(prev => {
        let newScore = score;
        const newPipes = prev.map(pipe => {
          const newPipe = { ...pipe, x: pipe.x - 2 };
          
          // Check if bird passed pipe
          if (!pipe.passed && newPipe.x + PIPE_WIDTH < 50) {
            newPipe.passed = true;
            newScore++;
          }
          
          // Check collision
          if (newPipe.x < 50 + BIRD_SIZE &&
              newPipe.x + PIPE_WIDTH > 50 &&
              (bird.y < newPipe.gapY || bird.y + BIRD_SIZE > newPipe.gapY + PIPE_GAP)) {
            setGameState('gameOver');
          }
          
          return newPipe;
        }).filter(pipe => pipe.x > -PIPE_WIDTH);
        
        // Add new pipes
        if (newPipes.length < 3) {
          newPipes.push({
            x: GAME_WIDTH,
            gapY: 100 + Math.random() * 200,
            passed: false
          });
        }
        
        if (newScore !== score) {
          setScore(newScore);
        }
        
        return newPipes;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, bird.y, score]);

  const resetGame = () => {
    setBird({ y: 200, velocityY: 0, isSleeping: false, sleepTimer: 0 });
    setScore(0);
    setGameState('playing');
    
    const initialPipes: Pipe[] = [];
    for (let i = 0; i < 3; i++) {
      initialPipes.push({
        x: GAME_WIDTH + i * 200,
        gapY: 100 + Math.random() * 200,
        passed: false
      });
    }
    setPipes(initialPipes);
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-sky-200 to-sky-400 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-sky-300/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-sky-800">😴 Flap 'n' Nap</h1>
          <Badge className="bg-sky-500/20 text-sky-800 border-sky-500">
            Score: {score}
          </Badge>
          {bird.isSleeping && (
            <Badge className="bg-purple-500/20 text-purple-800 border-purple-500 animate-pulse">
              💤 SLEEPING!
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="text-sky-800 hover:bg-sky-200"
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGameState(prev => prev === 'playing' ? 'paused' : 'playing')}
            className="text-sky-800 hover:bg-sky-200"
          >
            {gameState === 'playing' ? '⏸️' : '▶️'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sky-800 hover:bg-sky-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          ref={gameAreaRef}
          className="relative border-4 border-sky-400 rounded-lg bg-gradient-to-b from-sky-100 to-sky-200 overflow-hidden cursor-pointer"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Bird */}
          <div
            className={`absolute flex items-center justify-center text-2xl transition-all duration-100 ${
              bird.isSleeping ? 'animate-pulse' : ''
            }`}
            style={{
              left: 50,
              top: bird.y,
              width: BIRD_SIZE,
              height: BIRD_SIZE,
              transform: bird.isSleeping ? 'rotate(20deg)' : `rotate(${Math.min(bird.velocityY * 3, 30)}deg)`
            }}
          >
            {bird.isSleeping ? '😴' : '🐦'}
          </div>

          {/* Sleep Zzz animation */}
          {bird.isSleeping && (
            <div
              className="absolute text-purple-600 font-bold animate-bounce"
              style={{ left: 85, top: bird.y - 10 }}
            >
              Zzz
            </div>
          )}

          {/* Pipes */}
          {pipes.map((pipe, index) => (
            <div key={index}>
              {/* Top pipe */}
              <div
                className="absolute bg-green-500 border-2 border-green-600"
                style={{
                  left: pipe.x,
                  top: 0,
                  width: PIPE_WIDTH,
                  height: pipe.gapY
                }}
              />
              {/* Bottom pipe */}
              <div
                className="absolute bg-green-500 border-2 border-green-600"
                style={{
                  left: pipe.x,
                  top: pipe.gapY + PIPE_GAP,
                  width: PIPE_WIDTH,
                  height: GAME_HEIGHT - (pipe.gapY + PIPE_GAP)
                }}
              />
            </div>
          ))}

          {/* Game State Overlays */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Game Paused</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p>Tap or press space to flap</p>
                  <p>Watch out! The bird randomly falls asleep! 😴</p>
                  <p>Tap twice quickly to wake it up!</p>
                  <Button onClick={() => setGameState('playing')}>Resume</Button>
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
                  <p className="text-2xl font-bold">Final Score: {score}</p>
                  <p>The sleepy bird crashed!</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={resetGame} className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Try Again
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
      </div>

      {/* Instructions */}
      <div className="p-4 bg-sky-300/50 backdrop-blur-sm text-center text-sky-800 text-sm">
        TAP / SPACE: FLAP | WATCH OUT FOR RANDOM SLEEPS! 😴 | TAP TO WAKE UP
      </div>
    </div>
  );
}
