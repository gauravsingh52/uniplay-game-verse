
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface JellyStackGameProps {
  onClose: () => void;
}

interface JellyBlock {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  velocityX: number;
  velocityY: number;
  bouncing: boolean;
  settled: boolean;
}

const JELLY_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
const GAME_WIDTH = 600;
const GAME_HEIGHT = 800;
const JELLY_HEIGHT = 40;

export default function JellyStackGame({ onClose }: JellyStackGameProps) {
  const [jellyBlocks, setJellyBlocks] = useState<JellyBlock[]>([]);
  const [currentJelly, setCurrentJelly] = useState<JellyBlock | null>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'paused'>('playing');
  const [dropSpeed, setDropSpeed] = useState(2);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();

  // Create new jelly block
  const createNewJelly = useCallback(() => {
    const baseWidth = 100;
    const width = baseWidth + Math.random() * 50;
    
    const newJelly: JellyBlock = {
      id: Date.now(),
      x: Math.random() * (GAME_WIDTH - width),
      y: 0,
      width,
      height: JELLY_HEIGHT,
      color: JELLY_COLORS[Math.floor(Math.random() * JELLY_COLORS.length)],
      velocityX: 0,
      velocityY: dropSpeed,
      bouncing: false,
      settled: false
    };
    
    setCurrentJelly(newJelly);
  }, [dropSpeed]);

  // Drop jelly
  const dropJelly = useCallback(() => {
    if (!currentJelly || gameState !== 'playing') return;

    setJellyBlocks(prev => [...prev, currentJelly]);
    setCurrentJelly(null);
    setScore(prev => prev + 1);
    setDropSpeed(prev => Math.min(8, prev + 0.1));
    
    setTimeout(() => {
      createNewJelly();
    }, 500);
  }, [currentJelly, gameState, createNewJelly]);

  // Initialize first jelly
  useEffect(() => {
    createNewJelly();
  }, [createNewJelly]);

  // Handle click/tap
  useEffect(() => {
    const handleClick = () => dropJelly();
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        dropJelly();
      }
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [dropJelly]);

  // Physics simulation
  useEffect(() => {
    if (gameState !== 'playing') return;

    gameLoopRef.current = requestAnimationFrame(function gameLoop() {
      setJellyBlocks(prev => {
        return prev.map(jelly => {
          if (jelly.settled) return jelly;

          let newX = jelly.x + jelly.velocityX;
          let newY = jelly.y + jelly.velocityY;
          let newVelocityX = jelly.velocityX * 0.98; // Friction
          let newVelocityY = jelly.velocityY + 0.3; // Gravity
          let newBouncing = jelly.bouncing;
          let newSettled = jelly.settled;

          // Ground collision
          if (newY + jelly.height >= GAME_HEIGHT - 20) {
            newY = GAME_HEIGHT - 20 - jelly.height;
            newVelocityY = -newVelocityY * 0.6; // Bounce
            newBouncing = true;
            
            if (Math.abs(newVelocityY) < 1) {
              newVelocityY = 0;
              newSettled = true;
              newBouncing = false;
            }
          }

          // Wall collisions
          if (newX <= 0 || newX + jelly.width >= GAME_WIDTH) {
            newX = newX <= 0 ? 0 : GAME_WIDTH - jelly.width;
            newVelocityX = -newVelocityX * 0.7;
            newBouncing = true;
          }

          // Check collision with other blocks
          prev.forEach(otherJelly => {
            if (otherJelly.id === jelly.id) return;
            
            if (newX < otherJelly.x + otherJelly.width &&
                newX + jelly.width > otherJelly.x &&
                newY < otherJelly.y + otherJelly.height &&
                newY + jelly.height > otherJelly.y) {
              
              // Simple collision response - bounce off
              const centerX = jelly.x + jelly.width / 2;
              const otherCenterX = otherJelly.x + otherJelly.width / 2;
              
              if (centerX < otherCenterX) {
                newX = otherJelly.x - jelly.width;
                newVelocityX = -Math.abs(newVelocityX);
              } else {
                newX = otherJelly.x + otherJelly.width;
                newVelocityX = Math.abs(newVelocityX);
              }
              
              newVelocityY = -Math.abs(newVelocityY) * 0.5;
              newBouncing = true;
            }
          });

          // Check if stack is too misaligned (game over condition)
          const stackHeight = prev.filter(b => b.settled).length * JELLY_HEIGHT;
          if (stackHeight > GAME_HEIGHT * 0.7) {
            // Check if tower is stable enough
            const leftMost = Math.min(...prev.map(b => b.x));
            const rightMost = Math.max(...prev.map(b => b.x + b.width));
            if (rightMost - leftMost > GAME_WIDTH * 0.8) {
              setGameState('gameOver');
            }
          }

          return {
            ...jelly,
            x: newX,
            y: newY,
            velocityX: newVelocityX,
            velocityY: newVelocityY,
            bouncing: newBouncing,
            settled: newSettled
          };
        });
      });

      // Update current falling jelly
      if (currentJelly) {
        setCurrentJelly(prev => {
          if (!prev) return null;
          
          const newY = prev.y + prev.velocityY;
          
          if (newY > GAME_HEIGHT) {
            return null;
          }
          
          return { ...prev, y: newY };
        });
      }

      if (gameState === 'playing') {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    });

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, currentJelly]);

  const resetGame = () => {
    setJellyBlocks([]);
    setCurrentJelly(null);
    setScore(0);
    setDropSpeed(2);
    setGameState('playing');
    createNewJelly();
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-purple-400 via-pink-300 to-purple-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-purple-800">Jelly Stack</h1>
          <Badge className="bg-white/20 text-purple-800 border-purple-600">
            Height: {score}
          </Badge>
          <Badge className="bg-yellow-500/20 text-yellow-800 border-yellow-500">
            Speed: {dropSpeed.toFixed(1)}x
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="text-purple-800 hover:bg-purple-200/50"
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGameState(prev => prev === 'playing' ? 'paused' : 'playing')}
            className="text-purple-800 hover:bg-purple-200/50"
          >
            {gameState === 'playing' ? '⏸️' : '▶️'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-purple-800 hover:bg-purple-200/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          ref={gameAreaRef}
          className="relative border-4 border-purple-600 rounded-lg bg-gradient-to-b from-sky-200 to-green-200 overflow-hidden cursor-pointer"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          onClick={dropJelly}
        >
          {/* Ground */}
          <div className="absolute bottom-0 w-full h-5 bg-green-600" />

          {/* Current falling jelly */}
          {currentJelly && (
            <div
              className="absolute transition-all duration-100 border-2 border-white/50"
              style={{
                left: currentJelly.x,
                top: currentJelly.y,
                width: currentJelly.width,
                height: currentJelly.height,
                backgroundColor: currentJelly.color,
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                animation: 'none'
              }}
            />
          )}

          {/* Stacked jelly blocks */}
          {jellyBlocks.map((jelly) => (
            <div
              key={jelly.id}
              className={`absolute border-2 border-white/50 transition-all duration-100 ${
                jelly.bouncing ? 'animate-pulse' : ''
              }`}
              style={{
                left: jelly.x,
                top: jelly.y,
                width: jelly.width,
                height: jelly.height,
                backgroundColor: jelly.color,
                borderRadius: '10px',
                boxShadow: jelly.settled 
                  ? '0 2px 4px rgba(0,0,0,0.3)' 
                  : '0 4px 8px rgba(0,0,0,0.2)',
                transform: jelly.bouncing ? 'scale(1.05)' : 'scale(1)',
                opacity: jelly.settled ? 1 : 0.9
              }}
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
                  <p>Click or press Space to drop jelly blocks</p>
                  <p>Stack them as high as possible without toppling!</p>
                  <Button onClick={() => setGameState('playing')}>Resume Game</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Jelly Tower Collapsed!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-2xl font-bold text-purple-600">Height Reached: {score}</p>
                  <p>Your jelly tower became too unstable!</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={resetGame} className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Stack Again
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
      <div className="p-2 bg-black/20 backdrop-blur-sm text-center text-purple-800 text-sm">
        Click or press Space to drop jelly blocks! Stack them carefully - they bounce and wobble!
      </div>
    </div>
  );
}
