
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface SnailSprintGameProps {
  onClose: () => void;
}

interface Trap {
  x: number;
  y: number;
  type: 'spike' | 'bird' | 'salt';
  active: boolean;
  size: number;
}

interface Snail {
  x: number;
  y: number;
  isHiding: boolean;
  direction: number;
  shell: boolean;
}

export default function SnailSprintGame({ onClose }: SnailSprintGameProps) {
  const [snail, setSnail] = useState<Snail>({ x: 50, y: 300, isHiding: false, direction: 1, shell: true });
  const [traps, setTraps] = useState<Trap[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'paused'>('playing');
  const [isPressed, setIsPressed] = useState(false);
  const [hideTime, setHideTime] = useState(0);
  const [slowMotion, setSlowMotion] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 400;
  const SNAIL_SIZE = 30;

  // Generate traps
  useEffect(() => {
    const generateTraps = () => {
      const newTraps: Trap[] = [];
      for (let i = 0; i < 8; i++) {
        const types: ('spike' | 'bird' | 'salt')[] = ['spike', 'bird', 'salt'];
        const type = types[Math.floor(Math.random() * types.length)];
        newTraps.push({
          x: 200 + i * 100 + Math.random() * 50,
          y: type === 'bird' ? 150 + Math.random() * 100 : 280 + Math.random() * 50,
          type,
          active: Math.random() > 0.3,
          size: type === 'spike' ? 25 : type === 'bird' ? 35 : 20
        });
      }
      setTraps(newTraps);
    };
    
    generateTraps();
  }, []);

  // Handle movement
  const handleMove = useCallback(() => {
    if (gameState !== 'playing' || snail.isHiding) return;
    setIsPressed(true);
  }, [gameState, snail.isHiding]);

  const handleHide = useCallback(() => {
    if (gameState !== 'playing') return;
    setSnail(prev => ({ ...prev, isHiding: true, shell: true }));
    setHideTime(60); // Hide for 1 second (60 frames)
  }, [gameState]);

  // Handle keyboard/touch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleMove();
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        e.preventDefault();
        handleHide();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPressed(false);
      }
    };

    const handleMouseDown = () => handleMove();
    const handleMouseUp = () => setIsPressed(false);
    const handleDoubleClick = () => handleHide();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [handleMove, handleHide]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Update snail
      setSnail(prev => {
        let newX = prev.x;
        let newIsHiding = prev.isHiding;
        let newShell = prev.shell;

        // Move snail when pressed
        if (isPressed && !prev.isHiding) {
          newX += 2; // Slow snail speed
          setScore(s => s + 1);
        }

        // Update hiding state
        if (hideTime > 0) {
          setHideTime(h => h - 1);
          newIsHiding = true;
          newShell = true;
        } else {
          newIsHiding = false;
          newShell = false;
        }

        return {
          ...prev,
          x: newX,
          isHiding: newIsHiding,
          shell: newShell
        };
      });

      // Update traps (animate them)
      setTraps(prev => prev.map(trap => ({
        ...trap,
        active: trap.type === 'bird' ? Math.random() > 0.7 : trap.active,
        y: trap.type === 'bird' 
          ? trap.y + Math.sin(Date.now() / 200) * 2 
          : trap.y
      })));

      // Check collisions only if not hiding
      if (!snail.isHiding) {
        traps.forEach(trap => {
          if (!trap.active) return;
          
          const distance = Math.sqrt(
            Math.pow(snail.x - trap.x, 2) + Math.pow(snail.y - trap.y, 2)
          );
          
          if (distance < SNAIL_SIZE) {
            setGameState('gameOver');
          }
        });
      }

      // Slow motion effect when near traps
      const nearTrap = traps.some(trap => 
        trap.active && Math.abs(snail.x - trap.x) < 80 && Math.abs(snail.y - trap.y) < 80
      );
      setSlowMotion(nearTrap && !snail.isHiding);

      // Check win condition
      if (snail.x > GAME_WIDTH - 100) {
        setScore(prev => prev + 100);
        setSnail(prev => ({ ...prev, x: 50 }));
        // Generate new traps
        const newTraps: Trap[] = [];
        for (let i = 0; i < 8; i++) {
          const types: ('spike' | 'bird' | 'salt')[] = ['spike', 'bird', 'salt'];
          const type = types[Math.floor(Math.random() * types.length)];
          newTraps.push({
            x: 200 + i * 100 + Math.random() * 50,
            y: type === 'bird' ? 150 + Math.random() * 100 : 280 + Math.random() * 50,
            type,
            active: Math.random() > 0.3,
            size: type === 'spike' ? 25 : type === 'bird' ? 35 : 20
          });
        }
        setTraps(newTraps);
      }
    }, slowMotion ? 100 : 50);

    return () => clearInterval(gameLoop);
  }, [gameState, isPressed, snail, traps, hideTime, slowMotion]);

  const resetGame = () => {
    setSnail({ x: 50, y: 300, isHiding: false, direction: 1, shell: false });
    setScore(0);
    setHideTime(0);
    setSlowMotion(false);
    setIsPressed(false);
    setGameState('playing');
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-green-300 via-green-200 to-yellow-100 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-green-800">Snail Sprint</h1>
          <Badge className="bg-white/20 text-green-800 border-green-600">
            Distance: {score}m
          </Badge>
          {snail.isHiding && (
            <Badge className="bg-blue-500/20 text-blue-800 border-blue-500 animate-pulse">
              🐚 Hidden
            </Badge>
          )}
          {slowMotion && (
            <Badge className="bg-yellow-500/20 text-yellow-800 border-yellow-500">
              ⏱️ Slow Motion
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="text-green-800 hover:bg-green-200/50"
          >
            {isSoundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGameState(prev => prev === 'playing' ? 'paused' : 'playing')}
            className="text-green-800 hover:bg-green-200/50"
          >
            {gameState === 'playing' ? '⏸️' : '▶️'}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-green-800 hover:bg-green-200/50"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          ref={gameAreaRef}
          className="relative border-4 border-green-600 rounded-lg bg-gradient-to-b from-green-100 to-brown-200 overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Garden path */}
          <div className="absolute bottom-0 w-full h-20 bg-yellow-600 opacity-50" />
          
          {/* Flowers decoration */}
          <div className="absolute top-10 left-10 text-2xl">🌸</div>
          <div className="absolute top-20 right-20 text-2xl">🌻</div>
          <div className="absolute top-50 left-30 text-2xl">🌺</div>

          {/* Snail */}
          <div
            className={`absolute transition-all duration-300 text-2xl ${
              snail.isHiding ? 'scale-75 opacity-60' : 'scale-100'
            } ${isPressed ? 'animate-bounce' : ''}`}
            style={{
              left: snail.x,
              top: snail.y,
              filter: slowMotion ? 'hue-rotate(60deg)' : 'none',
              zIndex: 10
            }}
          >
            {snail.isHiding ? '🐚' : snail.shell ? '🐌' : '🟤'}
          </div>

          {/* Traps */}
          {traps.map((trap, index) => (
            <div
              key={index}
              className={`absolute transition-all duration-300 ${
                trap.active ? 'opacity-100' : 'opacity-30'
              } ${trap.type === 'bird' ? 'animate-bounce' : ''}`}
              style={{
                left: trap.x,
                top: trap.y,
                fontSize: trap.size + 'px',
                transform: trap.active ? 'scale(1.1)' : 'scale(0.9)'
              }}
            >
              {trap.type === 'spike' && '⚡'}
              {trap.type === 'bird' && '🦅'}
              {trap.type === 'salt' && '🧂'}
            </div>
          ))}

          {/* Finish line */}
          <div 
            className="absolute top-0 bottom-0 w-6 bg-green-800 opacity-60"
            style={{ left: GAME_WIDTH - 100 }}
          >
            <div className="w-full h-full bg-yellow-400 opacity-70" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">
              🏁
            </div>
          </div>

          {/* Game State Overlays */}
          {gameState === 'paused' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Game Paused</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p>Hold Space/Click to move slowly but smartly</p>
                  <p>Press S or Double-click to hide in shell from traps</p>
                  <Button onClick={() => setGameState('playing')}>Resume Game</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Snail Caught!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-2xl font-bold text-green-600">Distance: {score}m</p>
                  <p>You hit a trap! Remember to hide in your shell!</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={resetGame} className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Try Again
                    </Button>
                    <Button onClick={onClose} variant="outline">
                      Exit Garden
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-black/20 backdrop-blur-sm text-center text-green-800">
        <p className="text-sm">
          <span className="font-semibold">HOLD SPACE/CLICK:</span> Move Forward | 
          <span className="font-semibold"> S/DOUBLE-CLICK:</span> Hide in Shell | 
          <span className="font-semibold"> Special:</span> Time slows near traps!
        </p>
      </div>
    </div>
  );
}
