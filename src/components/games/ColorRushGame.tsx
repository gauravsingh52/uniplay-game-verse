
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface ColorRushGameProps {
  onClose: () => void;
}

interface ColorOrb {
  x: number;
  y: number;
  color: string;
  id: number;
  collected: boolean;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PLAYER_SIZE = 30;
const ORB_SIZE = 20;
const MOVE_SPEED = 5;

const COLORS = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

export default function ColorRushGame({ onClose }: ColorRushGameProps) {
  const [playerPos, setPlayerPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [orbs, setOrbs] = useState<ColorOrb[]>([]);
  const [targetColor, setTargetColor] = useState(COLORS[0]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'paused'>('playing');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const keysPressed = useRef<Set<string>>(new Set());

  // Generate random orbs
  const generateOrbs = useCallback(() => {
    const newOrbs: ColorOrb[] = [];
    for (let i = 0; i < 15; i++) {
      newOrbs.push({
        x: Math.random() * (GAME_WIDTH - ORB_SIZE),
        y: Math.random() * (GAME_HEIGHT - ORB_SIZE),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        id: i,
        collected: false
      });
    }
    setOrbs(newOrbs);
  }, []);

  // Initialize game
  useEffect(() => {
    generateOrbs();
    setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  }, [generateOrbs]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
        keysPressed.current.add(e.key);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Move player
      setPlayerPos(prev => {
        const keys = keysPressed.current;
        let newX = prev.x;
        let newY = prev.y;

        if (keys.has('ArrowLeft') || keys.has('a')) newX -= MOVE_SPEED;
        if (keys.has('ArrowRight') || keys.has('d')) newX += MOVE_SPEED;
        if (keys.has('ArrowUp') || keys.has('w')) newY -= MOVE_SPEED;
        if (keys.has('ArrowDown') || keys.has('s')) newY += MOVE_SPEED;

        // Boundary checks
        newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, newX));
        newY = Math.max(0, Math.min(GAME_HEIGHT - PLAYER_SIZE, newY));

        return { x: newX, y: newY };
      });

      // Check collisions with orbs
      setOrbs(prev => {
        let newOrbs = [...prev];
        let scoreIncrease = 0;
        let shouldChangeTarget = false;

        newOrbs.forEach(orb => {
          if (!orb.collected &&
              playerPos.x < orb.x + ORB_SIZE &&
              playerPos.x + PLAYER_SIZE > orb.x &&
              playerPos.y < orb.y + ORB_SIZE &&
              playerPos.y + PLAYER_SIZE > orb.y) {
            
            if (orb.color === targetColor) {
              orb.collected = true;
              scoreIncrease += 10;
              shouldChangeTarget = true;
            } else {
              // Wrong color penalty
              scoreIncrease -= 5;
            }
          }
        });

        if (scoreIncrease !== 0) {
          setScore(prev => Math.max(0, prev + scoreIncrease));
        }

        if (shouldChangeTarget) {
          setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        }

        // Check if all target color orbs are collected
        const remainingTargetOrbs = newOrbs.filter(orb => 
          orb.color === targetColor && !orb.collected
        );

        if (remainingTargetOrbs.length === 0) {
          // Regenerate orbs
          setTimeout(() => {
            generateOrbs();
            setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
          }, 100);
        }

        return newOrbs;
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, playerPos, targetColor, generateOrbs]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  const resetGame = () => {
    setPlayerPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    generateOrbs();
    setTargetColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
  };

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    return colorMap[color] || 'bg-gray-500';
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-pink-200/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-pink-800">🌈 Color Rush</h1>
          <Badge className="bg-pink-500/20 text-pink-800 border-pink-500">
            Score: {score}
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-800 border-purple-500">
            Time: {timeLeft}s
          </Badge>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Collect:</span>
            <div className={`w-6 h-6 rounded-full border-2 border-black ${getColorStyle(targetColor)}`}></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="text-pink-800 hover:bg-pink-200"
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGameState(prev => prev === 'playing' ? 'paused' : 'playing')}
            className="text-pink-800 hover:bg-pink-200"
          >
            {gameState === 'playing' ? '⏸️' : '▶️'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-pink-800 hover:bg-pink-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="relative border-4 border-pink-400 rounded-lg bg-white/80 overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Player */}
          <div
            className="absolute bg-gray-800 border-2 border-gray-600 rounded-full flex items-center justify-center text-lg transition-all duration-75"
            style={{
              left: playerPos.x,
              top: playerPos.y,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE
            }}
          >
            😎
          </div>

          {/* Color Orbs */}
          {orbs.map((orb) => (
            !orb.collected && (
              <div
                key={orb.id}
                className={`absolute rounded-full border-2 border-black transition-all duration-300 ${getColorStyle(orb.color)}`}
                style={{
                  left: orb.x,
                  top: orb.y,
                  width: ORB_SIZE,
                  height: ORB_SIZE
                }}
              />
            )
          ))}

          {/* Game State Overlays */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Game Paused</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p>Arrow keys or WASD to move</p>
                  <p>Collect the colored orbs that match the target color</p>
                  <p>Wrong colors lose points!</p>
                  <Button onClick={() => setGameState('playing')}>Resume</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Time's Up!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-2xl font-bold">Final Score: {score}</p>
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
      </div>

      {/* Instructions */}
      <div className="p-4 bg-pink-200/50 backdrop-blur-sm text-center text-pink-800 text-sm">
        ARROW KEYS / WASD: MOVE | COLLECT THE CORRECT COLOR ORBS | AVOID WRONG COLORS!
      </div>
    </div>
  );
}
