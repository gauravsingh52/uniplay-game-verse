
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface PlantPanicGameProps {
  onClose: () => void;
}

interface Bug {
  id: number;
  x: number;
  y: number;
  type: 'aphid' | 'spider' | 'beetle';
  speed: number;
  direction: number;
  isAlive: boolean;
  isFakingDeath: boolean;
  fakeDeathTimer: number;
  emoji: string;
}

interface Plant {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  type: string;
  emoji: string;
}

const BUG_TYPES = [
  { type: 'aphid' as const, emoji: '🐛', speed: 1, fake: false },
  { type: 'spider' as const, emoji: '🕷️', speed: 2, fake: true },
  { type: 'beetle' as const, emoji: '🪲', speed: 1.5, fake: false }
];

export default function PlantPanicGame({ onClose }: PlantPanicGameProps) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'paused'>('playing');
  const [waveNumber, setWaveNumber] = useState(1);
  const [bugsSquashed, setBugsSquashed] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 600;

  // Initialize plants
  useEffect(() => {
    const newPlants: Plant[] = [
      { x: 100, y: 150, health: 100, maxHealth: 100, type: 'sunflower', emoji: '🌻' },
      { x: 250, y: 200, health: 100, maxHealth: 100, type: 'rose', emoji: '🌹' },
      { x: 400, y: 180, health: 100, maxHealth: 100, type: 'tulip', emoji: '🌷' },
      { x: 550, y: 160, health: 100, maxHealth: 100, type: 'daisy', emoji: '🌼' },
      { x: 200, y: 350, health: 100, maxHealth: 100, type: 'cactus', emoji: '🌵' },
      { x: 500, y: 320, health: 100, maxHealth: 100, type: 'herb', emoji: '🌿' }
    ];
    setPlants(newPlants);
  }, []);

  // Spawn bugs
  const spawnBugs = useCallback(() => {
    const bugCount = 3 + waveNumber;
    const newBugs: Bug[] = [];
    
    for (let i = 0; i < bugCount; i++) {
      const bugType = BUG_TYPES[Math.floor(Math.random() * BUG_TYPES.length)];
      const spawnSide = Math.random() < 0.5 ? 'left' : 'right';
      
      newBugs.push({
        id: Date.now() + i,
        x: spawnSide === 'left' ? -30 : GAME_WIDTH + 30,
        y: 100 + Math.random() * (GAME_HEIGHT - 200),
        type: bugType.type,
        speed: bugType.speed,
        direction: spawnSide === 'left' ? 1 : -1,
        isAlive: true,
        isFakingDeath: false,
        fakeDeathTimer: 0,
        emoji: bugType.emoji
      });
    }
    
    setBugs(prev => [...prev, ...newBugs]);
  }, [waveNumber]);

  // Initial bug spawn
  useEffect(() => {
    spawnBugs();
  }, [spawnBugs]);

  // Handle bug tap
  const handleBugTap = useCallback((bugId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    
    setBugs(prev => prev.map(bug => {
      if (bug.id === bugId && bug.isAlive) {
        // Some bugs fake death
        if (bug.type === 'spider' && Math.random() < 0.4 && !bug.isFakingDeath) {
          return {
            ...bug,
            isFakingDeath: true,
            fakeDeathTimer: 120 // 2 seconds
          };
        } else {
          setScore(s => s + 10);
          setBugsSquashed(s => s + 1);
          return { ...bug, isAlive: false };
        }
      }
      return bug;
    }));
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Update bugs
      setBugs(prev => {
        return prev.map(bug => {
          if (!bug.isAlive && !bug.isFakingDeath) return bug;
          
          let newX = bug.x;
          let newFakeDeathTimer = bug.fakeDeathTimer;
          let newIsFakingDeath = bug.isFakingDeath;
          let newIsAlive = bug.isAlive;

          // Handle fake death
          if (bug.isFakingDeath) {
            newFakeDeathTimer--;
            if (newFakeDeathTimer <= 0) {
              newIsFakingDeath = false;
              newIsAlive = true;
            }
          } else if (bug.isAlive) {
            // Move bug
            newX += bug.direction * bug.speed;
          }

          return {
            ...bug,
            x: newX,
            fakeDeathTimer: newFakeDeathTimer,
            isFakingDeath: newIsFakingDeath,
            isAlive: newIsAlive
          };
        }).filter(bug => {
          // Remove bugs that went off screen (but not fake dead ones)
          if (!bug.isAlive && !bug.isFakingDeath) return false;
          return bug.x > -50 && bug.x < GAME_WIDTH + 50;
        });
      });

      // Check plant damage
      setPlants(prev => {
        return prev.map(plant => {
          let damage = 0;
          
          bugs.forEach(bug => {
            if (!bug.isAlive || bug.isFakingDeath) return;
            
            const distance = Math.sqrt(
              Math.pow(bug.x - plant.x, 2) + Math.pow(bug.y - plant.y, 2)
            );
            
            if (distance < 50) {
              damage += 0.5;
            }
          });
          
          return {
            ...plant,
            health: Math.max(0, plant.health - damage)
          };
        });
      });

      // Check game over
      const allPlantsDead = plants.every(plant => plant.health <= 0);
      if (allPlantsDead) {
        setGameState('gameOver');
      }

      // Check wave completion
      const aliveBugs = bugs.filter(bug => bug.isAlive).length;
      if (aliveBugs === 0 && bugs.length > 0) {
        setWaveNumber(prev => prev + 1);
        setBugs([]);
        setTimeout(() => {
          spawnBugs();
        }, 1000);
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState, bugs, plants, spawnBugs]);

  const resetGame = () => {
    setScore(0);
    setBugsSquashed(0);
    setWaveNumber(1);
    setBugs([]);
    setGameState('playing');
    
    // Reset plants
    const newPlants: Plant[] = [
      { x: 100, y: 150, health: 100, maxHealth: 100, type: 'sunflower', emoji: '🌻' },
      { x: 250, y: 200, health: 100, maxHealth: 100, type: 'rose', emoji: '🌹' },
      { x: 400, y: 180, health: 100, maxHealth: 100, type: 'tulip', emoji: '🌷' },
      { x: 550, y: 160, health: 100, maxHealth: 100, type: 'daisy', emoji: '🌼' },
      { x: 200, y: 350, health: 100, maxHealth: 100, type: 'cactus', emoji: '🌵' },
      { x: 500, y: 320, health: 100, maxHealth: 100, type: 'herb', emoji: '🌿' }
    ];
    setPlants(newPlants);
    
    spawnBugs();
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-green-200 via-green-100 to-yellow-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-green-800">Plant Panic</h1>
          <Badge className="bg-white/20 text-green-800 border-green-600">
            Score: {score}
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-800 border-blue-500">
            Wave: {waveNumber}
          </Badge>
          <Badge className="bg-red-500/20 text-red-800 border-red-500">
            Squashed: {bugsSquashed}
          </Badge>
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
          className="relative border-4 border-green-600 rounded-lg bg-gradient-to-b from-green-50 to-brown-100 overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Plants */}
          {plants.map((plant, index) => (
            <div key={index} className="absolute">
              <div
                className="text-4xl transition-all duration-300"
                style={{
                  left: plant.x,
                  top: plant.y,
                  filter: plant.health < 30 ? 'grayscale(100%)' : 
                          plant.health < 60 ? 'grayscale(50%)' : 'none',
                  transform: plant.health < 30 ? 'scale(0.8)' : 'scale(1)'
                }}
              >
                {plant.emoji}
              </div>
              
              {/* Health bar */}
              <div 
                className="absolute bg-black/30 rounded-full"
                style={{ left: plant.x - 10, top: plant.y - 15, width: 60, height: 6 }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${(plant.health / plant.maxHealth) * 100}%`,
                    backgroundColor: plant.health > 60 ? '#22C55E' : 
                                   plant.health > 30 ? '#F59E0B' : '#EF4444'
                  }}
                />
              </div>
            </div>
          ))}

          {/* Bugs */}
          {bugs.map((bug) => (
            <div
              key={bug.id}
              className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 ${
                bug.isFakingDeath ? 'rotate-180 opacity-60' : ''
              } ${!bug.isAlive && !bug.isFakingDeath ? 'opacity-30 rotate-180' : ''}`}
              style={{
                left: bug.x,
                top: bug.y,
                fontSize: '24px',
                zIndex: bug.isAlive ? 10 : 1
              }}
              onClick={(e) => handleBugTap(bug.id, e)}
            >
              {bug.emoji}
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
                  <p>Tap on bugs to squash them!</p>
                  <p>🕷️ Spiders sometimes fake death - watch out!</p>
                  <p>Protect your plants from bug damage!</p>
                  <Button onClick={() => setGameState('playing')}>Resume Game</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Garden Destroyed!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-2xl font-bold text-green-600">Final Score: {score}</p>
                  <p>Wave Reached: {waveNumber}</p>
                  <p>Bugs Squashed: {bugsSquashed}</p>
                  <p>The bugs destroyed all your plants!</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={resetGame} className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Plant Again
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
          <span className="font-semibold">TAP BUGS:</span> Squash them before they damage plants | 
          <span className="font-semibold"> WARNING:</span> Some bugs fake death! | 
          <span className="font-semibold"> Goal:</span> Survive as many waves as possible!
        </p>
      </div>
    </div>
  );
}
