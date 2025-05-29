
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface ToastEscapeGameProps {
  onClose: () => void;
}

interface Player {
  x: number;
  y: number;
  speed: number;
}

interface Obstacle {
  x: number;
  y: number;
  type: 'syrup' | 'butter' | 'wall';
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PLAYER_SIZE = 20;
const BASE_SPEED = 3;

export default function ToastEscapeGame({ onClose }: ToastEscapeGameProps) {
  const [player, setPlayer] = useState<Player>({ x: 50, y: 50, speed: BASE_SPEED });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'paused' | 'won'>('playing');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const keysPressed = useRef<Set<string>>(new Set());

  // Generate maze obstacles
  useEffect(() => {
    const newObstacles: Obstacle[] = [];
    
    // Add walls
    for (let i = 0; i < 15; i++) {
      newObstacles.push({
        x: Math.random() * (GAME_WIDTH - 40),
        y: Math.random() * (GAME_HEIGHT - 40),
        type: 'wall'
      });
    }
    
    // Add syrup traps
    for (let i = 0; i < 8; i++) {
      newObstacles.push({
        x: Math.random() * (GAME_WIDTH - 30),
        y: Math.random() * (GAME_HEIGHT - 30),
        type: 'syrup'
      });
    }
    
    // Add butter boosts
    for (let i = 0; i < 5; i++) {
      newObstacles.push({
        x: Math.random() * (GAME_WIDTH - 30),
        y: Math.random() * (GAME_HEIGHT - 30),
        type: 'butter'
      });
    }
    
    setObstacles(newObstacles);
  }, []);

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
      setPlayer(prev => {
        const keys = keysPressed.current;
        let newX = prev.x;
        let newY = prev.y;
        let newSpeed = BASE_SPEED;

        // Movement
        if (keys.has('ArrowLeft') || keys.has('a')) newX -= prev.speed;
        if (keys.has('ArrowRight') || keys.has('d')) newX += prev.speed;
        if (keys.has('ArrowUp') || keys.has('w')) newY -= prev.speed;
        if (keys.has('ArrowDown') || keys.has('s')) newY += prev.speed;

        // Boundary checks
        newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, newX));
        newY = Math.max(0, Math.min(GAME_HEIGHT - PLAYER_SIZE, newY));

        // Check collisions with obstacles
        obstacles.forEach(obstacle => {
          if (newX < obstacle.x + 30 &&
              newX + PLAYER_SIZE > obstacle.x &&
              newY < obstacle.y + 30 &&
              newY + PLAYER_SIZE > obstacle.y) {
            
            if (obstacle.type === 'wall') {
              // Block movement
              newX = prev.x;
              newY = prev.y;
            } else if (obstacle.type === 'syrup') {
              newSpeed = BASE_SPEED * 0.5; // Slow down
            } else if (obstacle.type === 'butter') {
              newSpeed = BASE_SPEED * 1.8; // Speed up
            }
          }
        });

        // Check win condition (reach exit)
        if (newX > GAME_WIDTH - 40 && newY > GAME_HEIGHT - 40) {
          setGameState('won');
        }

        return { x: newX, y: newY, speed: newSpeed };
      });

      setScore(prev => prev + 1);
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, obstacles]);

  const resetGame = () => {
    setPlayer({ x: 50, y: 50, speed: BASE_SPEED });
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-orange-200/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-orange-800">🍞 Toast Escape</h1>
          <Badge className="bg-orange-500/20 text-orange-800 border-orange-500">
            Time: {Math.floor(score / 60)}s
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="text-orange-800 hover:bg-orange-200"
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGameState(prev => prev === 'playing' ? 'paused' : 'playing')}
            className="text-orange-800 hover:bg-orange-200"
          >
            {gameState === 'playing' ? '⏸️' : '▶️'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-orange-800 hover:bg-orange-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="relative border-4 border-orange-400 rounded-lg bg-yellow-50 overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Player (Toast) */}
          <div
            className="absolute bg-orange-300 border-2 border-orange-500 rounded flex items-center justify-center text-lg transition-all duration-75"
            style={{
              left: player.x,
              top: player.y,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE
            }}
          >
            🍞
          </div>

          {/* Obstacles */}
          {obstacles.map((obstacle, index) => (
            <div
              key={index}
              className={`absolute rounded ${
                obstacle.type === 'wall' ? 'bg-orange-600' :
                obstacle.type === 'syrup' ? 'bg-purple-400' : 'bg-yellow-400'
              }`}
              style={{
                left: obstacle.x,
                top: obstacle.y,
                width: 30,
                height: 30
              }}
            >
              {obstacle.type === 'wall' && '🧱'}
              {obstacle.type === 'syrup' && '🟣'}
              {obstacle.type === 'butter' && '🧈'}
            </div>
          ))}

          {/* Exit */}
          <div
            className="absolute bg-green-400 border-2 border-green-600 rounded flex items-center justify-center text-2xl"
            style={{
              right: 10,
              bottom: 10,
              width: 30,
              height: 30
            }}
          >
            🚪
          </div>

          {/* Game State Overlays */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Game Paused</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p>Arrow keys or WASD to move</p>
                  <p>🟣 Syrup slows you down</p>
                  <p>🧈 Butter speeds you up</p>
                  <p>Reach the exit door!</p>
                  <Button onClick={() => setGameState('playing')}>Resume</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {(gameState === 'gameOver' || gameState === 'won') && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">
                    {gameState === 'won' ? 'Escaped!' : 'Game Over'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-2xl font-bold">
                    Time: {Math.floor(score / 60)} seconds
                  </p>
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
      <div className="p-4 bg-orange-200/50 backdrop-blur-sm text-center text-orange-800 text-sm">
        ARROW KEYS / WASD: MOVE | AVOID SYRUP 🟣 | COLLECT BUTTER 🧈 | REACH THE EXIT 🚪
      </div>
    </div>
  );
}
