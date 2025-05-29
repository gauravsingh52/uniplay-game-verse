
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface ZooZoomGameProps {
  onClose: () => void;
}

interface Animal {
  id: string;
  name: string;
  emoji: string;
  skill: string;
  speed: number;
  color: string;
}

interface Obstacle {
  x: number;
  y: number;
  type: 'log' | 'rock' | 'water';
  width: number;
  height: number;
}

const ANIMALS: Animal[] = [
  { id: 'cheetah', name: 'Cheetah', emoji: '🐆', skill: 'Super Speed', speed: 8, color: '#FFA500' },
  { id: 'elephant', name: 'Elephant', emoji: '🐘', skill: 'Break Obstacles', speed: 4, color: '#808080' },
  { id: 'monkey', name: 'Monkey', emoji: '🐵', skill: 'High Jump', speed: 6, color: '#8B4513' },
  { id: 'kangaroo', name: 'Kangaroo', emoji: '🦘', skill: 'Bounce', speed: 7, color: '#CD853F' }
];

export default function ZooZoomGame({ onClose }: ZooZoomGameProps) {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal>(ANIMALS[0]);
  const [animalPos, setAnimalPos] = useState({ x: 50, y: 200 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'selecting' | 'playing' | 'gameOver'>('selecting');
  const [isRunning, setIsRunning] = useState(false);
  const [skillCooldown, setSkillCooldown] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 400;

  // Generate obstacles
  const generateObstacles = useCallback(() => {
    const newObstacles: Obstacle[] = [];
    for (let i = 0; i < 10; i++) {
      const types: ('log' | 'rock' | 'water')[] = ['log', 'rock', 'water'];
      const type = types[Math.floor(Math.random() * types.length)];
      newObstacles.push({
        x: 200 + i * 120,
        y: type === 'water' ? 250 : 200 + Math.random() * 100,
        type,
        width: type === 'water' ? 100 : 40,
        height: type === 'water' ? 30 : 40
      });
    }
    setObstacles(newObstacles);
  }, []);

  // Handle running (tap rapidly)
  const handleRun = useCallback(() => {
    if (gameState === 'playing') {
      setIsRunning(true);
      setTimeout(() => setIsRunning(false), 100);
    }
  }, [gameState]);

  // Handle skill use
  const handleSkill = useCallback(() => {
    if (gameState === 'playing' && skillCooldown === 0) {
      setSkillCooldown(100); // 100 frames cooldown
      
      // Apply animal skill
      switch (selectedAnimal.id) {
        case 'cheetah':
          // Super speed boost
          setAnimalPos(prev => ({ ...prev, x: prev.x + 100 }));
          break;
        case 'elephant':
          // Break nearby obstacles
          setObstacles(prev => prev.filter(obs => 
            Math.abs(obs.x - animalPos.x) > 80 || obs.type === 'water'
          ));
          break;
        case 'monkey':
          // High jump
          setAnimalPos(prev => ({ ...prev, y: Math.max(50, prev.y - 80) }));
          setTimeout(() => {
            setAnimalPos(prev => ({ ...prev, y: 200 }));
          }, 500);
          break;
        case 'kangaroo':
          // Bounce forward
          setAnimalPos(prev => ({ ...prev, x: prev.x + 60, y: prev.y - 40 }));
          setTimeout(() => {
            setAnimalPos(prev => ({ ...prev, y: 200 }));
          }, 300);
          break;
      }
    }
  }, [gameState, skillCooldown, selectedAnimal, animalPos]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      // Move animal forward when running
      if (isRunning) {
        setAnimalPos(prev => ({ 
          ...prev, 
          x: prev.x + selectedAnimal.speed
        }));
        setScore(prev => prev + 1);
      }

      // Update skill cooldown
      setSkillCooldown(prev => Math.max(0, prev - 1));

      // Check collisions
      obstacles.forEach(obstacle => {
        if (animalPos.x < obstacle.x + obstacle.width &&
            animalPos.x + 40 > obstacle.x &&
            animalPos.y < obstacle.y + obstacle.height &&
            animalPos.y + 40 > obstacle.y) {
          
          // Different collision effects
          if (obstacle.type === 'water' && selectedAnimal.id !== 'elephant') {
            setGameState('gameOver');
          } else if (obstacle.type !== 'water') {
            setGameState('gameOver');
          }
        }
      });

      // Check win condition
      if (animalPos.x > GAME_WIDTH - 100) {
        setScore(prev => prev + 100);
        setAnimalPos({ x: 50, y: 200 });
        generateObstacles();
      }
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState, isRunning, selectedAnimal, animalPos, obstacles, generateObstacles]);

  // Handle keyboard/touch
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleRun();
      } else if (e.code === 'ArrowUp') {
        e.preventDefault();
        handleSkill();
      }
    };

    const handleClick = () => handleRun();
    const handleDoubleClick = () => handleSkill();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleClick);
    window.addEventListener('dblclick', handleDoubleClick);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('dblclick', handleDoubleClick);
    };
  }, [handleRun, handleSkill]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setAnimalPos({ x: 50, y: 200 });
    setSkillCooldown(0);
    generateObstacles();
  };

  const resetGame = () => {
    setGameState('selecting');
    setScore(0);
    setAnimalPos({ x: 50, y: 200 });
    setSkillCooldown(0);
  };

  if (gameState === 'selecting') {
    return (
      <div className="w-full h-full bg-gradient-to-b from-green-400 via-green-300 to-yellow-200 flex flex-col">
        <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
          <h1 className="text-2xl font-bold text-green-800">Zoo Zoom - Choose Your Animal!</h1>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-green-800">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="grid grid-cols-2 gap-6 max-w-2xl">
            {ANIMALS.map((animal) => (
              <Card 
                key={animal.id}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedAnimal.id === animal.id ? 'ring-4 ring-green-500' : ''
                }`}
                onClick={() => setSelectedAnimal(animal)}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-6xl mb-4">{animal.emoji}</div>
                  <h3 className="text-xl font-bold mb-2">{animal.name}</h3>
                  <Badge className="mb-2" style={{ backgroundColor: animal.color }}>
                    {animal.skill}
                  </Badge>
                  <p className="text-sm text-muted-foreground">Speed: {animal.speed}/10</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="p-4 text-center">
          <Button onClick={startGame} size="lg" className="bg-green-600 hover:bg-green-700">
            Start Race with {selectedAnimal.name}!
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-green-400 via-green-300 to-yellow-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-green-800">Zoo Zoom</h1>
          <Badge className="bg-white/20 text-green-800 border-green-600">
            Score: {score}
          </Badge>
          <Badge style={{ backgroundColor: selectedAnimal.color, color: 'white' }}>
            {selectedAnimal.emoji} {selectedAnimal.name}
          </Badge>
          {skillCooldown > 0 && (
            <Badge className="bg-red-500/20 text-red-800 border-red-500">
              Skill: {Math.ceil(skillCooldown / 20)}s
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onClose} className="text-green-800">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex items-center justify-center">
        <div 
          ref={gameAreaRef}
          className="relative border-4 border-green-600 rounded-lg bg-green-200 overflow-hidden"
          style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
        >
          {/* Track */}
          <div className="absolute bottom-0 w-full h-20 bg-yellow-600" />
          
          {/* Animal */}
          <div
            className="absolute transition-all duration-100 text-3xl"
            style={{
              left: animalPos.x,
              top: animalPos.y,
              transform: isRunning ? 'scale(1.2)' : 'scale(1)',
              zIndex: 10
            }}
          >
            {selectedAnimal.emoji}
          </div>

          {/* Obstacles */}
          {obstacles.map((obstacle, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                left: obstacle.x,
                top: obstacle.y,
                width: obstacle.width,
                height: obstacle.height,
                backgroundColor: obstacle.type === 'water' ? '#0EA5E9' : 
                                obstacle.type === 'rock' ? '#64748B' : '#92400E',
                borderRadius: obstacle.type === 'water' ? '50%' : '4px',
                border: '2px solid #000'
              }}
            >
              {obstacle.type === 'log' && '🪵'}
              {obstacle.type === 'rock' && '🪨'}
              {obstacle.type === 'water' && '🌊'}
            </div>
          ))}

          {/* Finish line */}
          <div 
            className="absolute top-0 bottom-0 w-4 bg-black opacity-50"
            style={{ left: GAME_WIDTH - 100 }}
          >
            <div className="w-full h-full bg-white opacity-50" />
          </div>

          {/* Game Over Overlay */}
          {gameState === 'gameOver' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-center">Race Over!</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-2xl font-bold">Final Score: {score}</p>
                  <p>You hit an obstacle!</p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={startGame} className="gap-2">
                      <RotateCcw className="h-4 w-4" />
                      Try Again
                    </Button>
                    <Button onClick={resetGame} variant="outline">
                      Choose New Animal
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
          <span className="font-semibold">TAP/SPACE:</span> Run Forward | 
          <span className="font-semibold"> DOUBLE-TAP/↑:</span> Use {selectedAnimal.skill} | 
          <span className="font-semibold"> Goal:</span> Reach the finish line!
        </p>
      </div>
    </div>
  );
}
