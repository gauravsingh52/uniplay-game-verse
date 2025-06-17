
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameEngine from '@/components/gameEngine/GameEngine';
import { useGameEngine } from '@/components/gameEngine/useGameEngine';
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface SnakeGameProps {
  onClose: () => void;
}

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

const EnhancedSnakeGame: React.FC<SnakeGameProps> = ({ onClose }) => {
  const { gameState, updateGameState, restartGame, addScore, loseLife, playSound, soundEnabled, toggleSound } = useGameEngine({
    gameId: 'enhanced-snake',
    initialLives: 1,
    levelUpScore: 500
  });

  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Position>({ x: 1, y: 0 });
  const [nextDirection, setNextDirection] = useState<Position>({ x: 1, y: 0 });
  const [gridDimensions, setGridDimensions] = useState({ width: 30, height: 20 });
  
  const gameLoopRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Calculate grid dimensions based on canvas size
  useEffect(() => {
    const updateGridSize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const width = Math.floor(rect.width / GRID_SIZE);
        const height = Math.floor(rect.height / GRID_SIZE);
        setGridDimensions({ width, height });
      }
    };

    updateGridSize();
    window.addEventListener('resize', updateGridSize);
    return () => window.removeEventListener('resize', updateGridSize);
  }, []);

  // Generate random food position
  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * gridDimensions.width),
        y: Math.floor(Math.random() * gridDimensions.height)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [gridDimensions]);

  // Move snake
  const moveSnake = useCallback(() => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      // Update direction
      head.x += nextDirection.x;
      head.y += nextDirection.y;

      // Check wall collision
      if (head.x < 0 || head.x >= gridDimensions.width || head.y < 0 || head.y >= gridDimensions.height) {
        playSound(200, 300);
        updateGameState({ isGameOver: true });
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        playSound(200, 300);
        updateGameState({ isGameOver: true });
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        playSound(800, 100);
        addScore(10 + (gameState.level * 5));
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });

    setDirection(nextDirection);
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, nextDirection, gridDimensions, food, addScore, gameState.level, playSound, generateFood, updateGameState]);

  // Game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
      const speed = Math.max(50, INITIAL_SPEED - (gameState.level - 1) * 10);
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameState.level, moveSnake]);

  // Keyboard controls
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        event.preventDefault();
        if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
        break;
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, direction]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Touch controls
  const handleDirectionChange = (newDirection: Position) => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;
    
    if ((newDirection.x !== 0 && direction.x === 0) || (newDirection.y !== 0 && direction.y === 0)) {
      setNextDirection(newDirection);
    }
  };

  // Restart game
  const handleRestart = () => {
    restartGame();
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setNextDirection({ x: 1, y: 0 });
  };

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridDimensions.width; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i <= gridDimensions.height; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(canvas.width, i * GRID_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#4ade80' : '#22c55e';
      ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
      
      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = '#000';
        ctx.fillRect(segment.x * GRID_SIZE + 4, segment.y * GRID_SIZE + 4, 3, 3);
        ctx.fillRect(segment.x * GRID_SIZE + 13, segment.y * GRID_SIZE + 4, 3, 3);
      }
    });

    // Draw food
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    
    // Add food sparkle effect
    ctx.fillStyle = '#fef2f2';
    ctx.fillRect(food.x * GRID_SIZE + 2, food.y * GRID_SIZE + 2, 3, 3);
  }, [snake, food, gridDimensions]);

  const mobileControls = (
    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
      <div></div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDirectionChange({ x: 0, y: -1 })}
        className="text-white border-white/30 hover:bg-white/20"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <div></div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDirectionChange({ x: -1, y: 0 })}
        className="text-white border-white/30 hover:bg-white/20"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div></div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDirectionChange({ x: 1, y: 0 })}
        className="text-white border-white/30 hover:bg-white/20"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
      <div></div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDirectionChange({ x: 0, y: 1 })}
        className="text-white border-white/30 hover:bg-white/20"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
      <div></div>
    </div>
  );

  return (
    <GameEngine
      gameId="enhanced-snake"
      title="Enhanced Snake"
      description="Classic snake game with modern controls and features"
      gameState={gameState}
      onStateChange={updateGameState}
      onRestart={handleRestart}
      onExit={onClose}
      controls={mobileControls}
      soundEnabled={soundEnabled}
      onSoundToggle={toggleSound}
      showLives={false}
      customStats={[
        { label: 'Length', value: snake.length },
        { label: 'Speed', value: `${Math.max(50, INITIAL_SPEED - (gameState.level - 1) * 10)}ms` }
      ]}
    >
      <canvas
        ref={canvasRef}
        width={gridDimensions.width * GRID_SIZE}
        height={gridDimensions.height * GRID_SIZE}
        className="w-full h-full bg-gray-900"
        style={{ imageRendering: 'pixelated' }}
      />
    </GameEngine>
  );
};

export default EnhancedSnakeGame;
