
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface CloudHopGameProps {
  onClose: () => void;
}

interface Player {
  x: number;
  y: number;
  velocityY: number;
}

interface Cloud {
  x: number;
  y: number;
  width: number;
  type: 'normal' | 'bouncy' | 'disappearing';
  visible: boolean;
}

const GAME_WIDTH = 600;
const GAME_HEIGHT = 400;
const PLAYER_SIZE = 20;
const GRAVITY = 0.4;
const JUMP_FORCE = -10;
const MOVE_SPEED = 4;

export default function CloudHopGame({ onClose }: CloudHopGameProps) {
  const [player, setPlayer] = useState<Player>({ x: 50, y: 300, velocityY: 0 });
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'paused'>('playing');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const keysPressed = useRef<Set<string>>(new Set());

  // Generate clouds
  useEffect(() => {
    const newClouds: Cloud[] = [
      { x: 0, y: GAME_HEIGHT - 30, width: 150, type: 'normal', visible: true },
      { x: 200, y: 320, width: 100, type: 'normal', visible: true },
      { x: 350, y: 250, width: 80, type: 'bouncy', visible: true },
      { x: 480, y: 180, width: 120, type: 'disappearing', visible: true },
      { x: 150, y: 120, width: 100, type: 'normal', visible: true },
      { x: 350, y: 80, width: 90, type: 'bouncy', visible: true },
      { x: 500, y: 50, width: 100, type: 'normal', visible: true },
    ];
    setClouds(newClouds);
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

        // Horizontal movement
        if (keys.has('ArrowLeft') || keys.has('a')) newX -= MOVE_SPEED;
        if (keys.has('ArrowRight') || keys.has('d')) newX += MOVE_SPEED;

        // Apply gravity
        newVelocityY += GRAVITY;
        newY += newVelocityY;

        // Boundary checks
        newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, newX));

        // Cloud collisions
        clouds.forEach((cloud, index) => {
          if (!cloud.visible) return;
          
          if (newX < cloud.x + cloud.width &&
              newX + PLAYER_SIZE > cloud.x &&
              newY < cloud.y + 20 &&
              newY + PLAYER_SIZE > cloud.y &&
              newVelocityY > 0) {
            
            newY = cloud.y - PLAYER_SIZE;
            
            if (cloud.type === 'normal') {
              newVelocityY = JUMP_FORCE;
            } else if (cloud.type === 'bouncy') {
              newVelocityY = JUMP_FORCE * 1.5; // Extra bounce
            } else if (cloud.type === 'disappearing') {
              newVelocityY = JUMP_FORCE;
              // Make cloud disappear after landing
              setClouds(prev => prev.map((c, i) => 
                i === index ? { ...c, visible: false } : c
              ));
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

        return { x: newX, y: newY, velocityY: newVelocityY };
      });
    }, 16);

    return () => clearInterval(gameLoop);
  }, [gameState, clouds]);

  const resetGame = () => {
    setPlayer({ x: 50, y: 300, velocityY: 0 });
    setScore(0);
    setGameState('playing');
    // Reset clouds
    setClouds(prev => prev.map(cloud => ({ ...cloud, visible: true })));
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-sky-200/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-sky-800">☁️ Cloud Hop</h1>
          <Badge className="bg-sky-500/20 text-sky-800 border-sky-500">
            Score: {score}
          </Badge>
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
          className="relative border-4 border-sky-400 rounded-lg bg-gradient-to-b from-sky-100 to-sky-50 overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Player */}
          <div
            className="absolute bg-yellow-400 border-2 border-yellow-600 rounded-full flex items-center justify-center text-lg transition-all duration-75"
            style={{
              left: player.x,
              top: player.y,
              width: PLAYER_SIZE,
              height: PLAYER_SIZE
            }}
          >
            😊
          </div>

          {/* Clouds */}
          {clouds.map((cloud, index) => (
            cloud.visible && (
              <div
                key={index}
                className={`absolute rounded-full flex items-center justify-center text-sm font-bold transition-opacity duration-300 ${
                  cloud.type === 'normal' ? 'bg-white border-2 border-gray-300' :
                  cloud.type === 'bouncy' ? 'bg-pink-200 border-2 border-pink-400' :
                  'bg-gray-200 border-2 border-gray-400'
                }`}
                style={{
                  left: cloud.x,
                  top: cloud.y,
                  width: cloud.width,
                  height: 20
                }}
              >
                {cloud.type === 'normal' && '☁️'}
                {cloud.type === 'bouncy' && '🌸'}
                {cloud.type === 'disappearing' && '💨'}
              </div>
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
                  <p>☁️ Normal clouds give regular jumps</p>
                  <p>🌸 Pink clouds give extra bounce</p>
                  <p>💨 Gray clouds disappear after use</p>
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
      <div className="p-4 bg-sky-200/50 backdrop-blur-sm text-center text-sky-800 text-sm">
        ARROW KEYS / WASD: MOVE | LAND ON CLOUDS TO JUMP | REACH THE SKY!
      </div>
    </div>
  );
}
