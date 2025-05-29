
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface PixelJumperGameProps {
  onClose: () => void;
}

interface Player {
  x: number;
  y: number;
  velocityY: number;
  grounded: boolean;
}

interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PLAYER_SIZE = 20;
const GRAVITY = 0.5;
const JUMP_FORCE = -12;
const MOVE_SPEED = 5;

export default function PixelJumperGame({ onClose }: PixelJumperGameProps) {
  const [player, setPlayer] = useState<Player>({ x: 50, y: 300, velocityY: 0, grounded: false });
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'paused'>('playing');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const keysPressed = useRef<Set<string>>(new Set());

  // Generate platforms
  useEffect(() => {
    const newPlatforms: Platform[] = [
      { x: 0, y: GAME_HEIGHT - 20, width: GAME_WIDTH, height: 20 }, // Ground
      { x: 150, y: 320, width: 100, height: 20 },
      { x: 300, y: 250, width: 100, height: 20 },
      { x: 450, y: 180, width: 100, height: 20 },
      { x: 200, y: 120, width: 100, height: 20 },
      { x: 400, y: 80, width: 100, height: 20 },
    ];
    setPlatforms(newPlatforms);
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'Space', 'a', 'd', 'w'].includes(e.key)) {
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
        let newVelocityY = prev.velocityY;
        let newGrounded = false;

        // Horizontal movement
        if (keys.has('ArrowLeft') || keys.has('a')) newX -= MOVE_SPEED;
        if (keys.has('ArrowRight') || keys.has('d')) newX += MOVE_SPEED;

        // Jumping
        if ((keys.has('ArrowUp') || keys.has('w') || keys.has(' ')) && prev.grounded) {
          newVelocityY = JUMP_FORCE;
        }

        // Apply gravity
        newVelocityY += GRAVITY;
        newY += newVelocityY;

        // Boundary checks
        newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, newX));

        // Platform collisions
        platforms.forEach(platform => {
          if (newX < platform.x + platform.width &&
              newX + PLAYER_SIZE > platform.x &&
              newY < platform.y + platform.height &&
              newY + PLAYER_SIZE > platform.y) {
            
            // Landing on top of platform
            if (prev.y + PLAYER_SIZE <= platform.y && newVelocityY > 0) {
              newY = platform.y - PLAYER_SIZE;
              newVelocityY = 0;
              newGrounded = true;
            }
            // Hitting platform from below
            else if (prev.y >= platform.y + platform.height && newVelocityY < 0) {
              newY = platform.y + platform.height;
              newVelocityY = 0;
            }
            // Hitting platform from side
            else if (newVelocityY >= 0) {
              if (newX < prev.x) {
                newX = platform.x + platform.width;
              } else {
                newX = platform.x - PLAYER_SIZE;
              }
            }
          }
        });

        // Game over if fell off screen
        if (newY > GAME_HEIGHT) {
          setGameState('gameOver');
        }

        // Score increases with height
        const heightScore = Math.max(0, Math.floor((GAME_HEIGHT - newY) / 10));
        setScore(prev => Math.max(prev, heightScore));

        return { x: newX, y: newY, velocityY: newVelocityY, grounded: newGrounded };
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, platforms]);

  const resetGame = () => {
    setPlayer({ x: 50, y: 300, velocityY: 0, grounded: false });
    setScore(0);
    setGameState('playing');
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-blue-200/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-800">🟦 Pixel Jumper</h1>
          <Badge className="bg-blue-500/20 text-blue-800 border-blue-500">
            Score: {score}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="text-blue-800 hover:bg-blue-200"
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGameState(prev => prev === 'playing' ? 'paused' : 'playing')}
            className="text-blue-800 hover:bg-blue-200"
          >
            {gameState === 'playing' ? '⏸️' : '▶️'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-blue-800 hover:bg-blue-200"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div 
          className="relative border-4 border-blue-400 rounded-lg bg-sky-50 overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Player */}
          <div
            className="absolute bg-blue-500 border-2 border-blue-700 rounded flex items-center justify-center text-lg transition-all duration-75"
            style={{
              left: player.x,
              top: player.y,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE
            }}
          >
            🟦
          </div>

          {/* Platforms */}
          {platforms.map((platform, index) => (
            <div
              key={index}
              className="absolute bg-gray-600 border border-gray-800"
              style={{
                left: platform.x,
                top: platform.y,
                width: platform.width,
                height: platform.height
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
                  <p>Arrow keys or WASD to move</p>
                  <p>UP or SPACE to jump</p>
                  <p>Reach higher platforms for more points!</p>
                  <Button onClick={() => setGameState('playing')}>Resume</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Game Over</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-2xl font-bold">Score: {score}</p>
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
      <div className="p-4 bg-blue-200/50 backdrop-blur-sm text-center text-blue-800 text-sm">
        ARROW KEYS / WASD: MOVE | UP / SPACE: JUMP | REACH HIGHER PLATFORMS FOR MORE POINTS!
      </div>
    </div>
  );
}
