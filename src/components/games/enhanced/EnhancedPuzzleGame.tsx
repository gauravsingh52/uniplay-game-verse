
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameEngine from '@/components/gameEngine/GameEngine';
import { useGameEngine } from '@/components/gameEngine/useGameEngine';
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";

interface Tile {
  id: number;
  value: number;
  isEmpty: boolean;
}

interface PuzzleGameProps {
  onClose: () => void;
}

const GRID_SIZE = 4;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

const EnhancedPuzzleGame: React.FC<PuzzleGameProps> = ({ onClose }) => {
  const { gameState, updateGameState, restartGame, addScore, playSound, soundEnabled, toggleSound } = useGameEngine({
    gameId: 'enhanced-puzzle',
    initialLives: 1,
    levelUpScore: 1000
  });

  const [tiles, setTiles] = useState<Tile[]>([]);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize puzzle
  const initializePuzzle = useCallback(() => {
    const newTiles: Tile[] = [];
    for (let i = 0; i < TOTAL_TILES - 1; i++) {
      newTiles.push({
        id: i,
        value: i + 1,
        isEmpty: false
      });
    }
    newTiles.push({
      id: TOTAL_TILES - 1,
      value: 0,
      isEmpty: true
    });
    
    // Shuffle tiles
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = newTiles.findIndex(tile => tile.isEmpty);
      const neighbors = getNeighbors(emptyIndex);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      
      // Swap empty tile with random neighbor
      [newTiles[emptyIndex], newTiles[randomNeighbor]] = [newTiles[randomNeighbor], newTiles[emptyIndex]];
    }
    
    setTiles(newTiles);
    setMoves(0);
    setIsComplete(false);
  }, []);

  // Get neighboring tile indices
  const getNeighbors = (index: number): number[] => {
    const neighbors: number[] = [];
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    
    // Up
    if (row > 0) neighbors.push(index - GRID_SIZE);
    // Down
    if (row < GRID_SIZE - 1) neighbors.push(index + GRID_SIZE);
    // Left
    if (col > 0) neighbors.push(index - 1);
    // Right
    if (col < GRID_SIZE - 1) neighbors.push(index + 1);
    
    return neighbors;
  };

  // Check if puzzle is solved
  const checkWin = useCallback((currentTiles: Tile[]) => {
    for (let i = 0; i < TOTAL_TILES - 1; i++) {
      if (currentTiles[i].value !== i + 1) {
        return false;
      }
    }
    return currentTiles[TOTAL_TILES - 1].isEmpty;
  }, []);

  // Move tile
  const moveTile = useCallback((tileIndex: number) => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver || isComplete) return;

    const emptyIndex = tiles.findIndex(tile => tile.isEmpty);
    const neighbors = getNeighbors(emptyIndex);
    
    if (neighbors.includes(tileIndex)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[tileIndex]] = [newTiles[tileIndex], newTiles[emptyIndex]];
      
      setTiles(newTiles);
      setMoves(prev => prev + 1);
      playSound(600, 100);
      
      if (checkWin(newTiles)) {
        setIsComplete(true);
        playSound(800, 300);
        
        // Calculate score based on moves and time
        const timeBonus = Math.max(0, 300 - gameState.timeElapsed);
        const moveBonus = Math.max(0, 100 - moves);
        const totalScore = 1000 + timeBonus * 10 + moveBonus * 10;
        
        addScore(totalScore);
        updateGameState({ isGameOver: true });
      }
    }
  }, [tiles, gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameState.timeElapsed, isComplete, moves, playSound, checkWin, addScore, updateGameState]);

  // Initialize on start
  useEffect(() => {
    if (tiles.length === 0) {
      initializePuzzle();
    }
  }, [tiles.length, initializePuzzle]);

  // Handle tile click
  const handleTileClick = useCallback((event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const tileSize = canvas.width / GRID_SIZE;
    const col = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);
    const tileIndex = row * GRID_SIZE + col;
    
    moveTile(tileIndex);
  }, [moveTile]);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((event: React.TouchEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const touch = event.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const tileSize = canvas.width / GRID_SIZE;
    const col = Math.floor(x / tileSize);
    const row = Math.floor(y / tileSize);
    const tileIndex = row * GRID_SIZE + col;
    
    moveTile(tileIndex);
  }, [moveTile]);

  // Restart game
  const handleRestart = () => {
    restartGame();
    initializePuzzle();
  };

  // Shuffle tiles
  const handleShuffle = () => {
    if (gameState.isPlaying) {
      initializePuzzle();
    }
  };

  // Draw puzzle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const tileSize = canvas.width / GRID_SIZE;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw tiles
    tiles.forEach((tile, index) => {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;
      const x = col * tileSize;
      const y = row * tileSize;
      
      if (!tile.isEmpty) {
        // Draw tile background
        ctx.fillStyle = isComplete ? '#4ade80' : '#3b82f6';
        ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
        
        // Draw tile border
        ctx.strokeStyle = '#1e40af';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 2, y + 2, tileSize - 4, tileSize - 4);
        
        // Draw tile number
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${tileSize / 3}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(
          tile.value.toString(),
          x + tileSize / 2,
          y + tileSize / 2
        );
      }
    });

    // Draw grid lines
    ctx.strokeStyle = '#4b5563';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(i * tileSize, 0);
      ctx.lineTo(i * tileSize, canvas.height);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, i * tileSize);
      ctx.lineTo(canvas.width, i * tileSize);
      ctx.stroke();
    }

    // Draw completion message
    if (isComplete) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, canvas.height / 2 - 40, canvas.width, 80);
      
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 24px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Puzzle Complete!', canvas.width / 2, canvas.height / 2);
    }
  }, [tiles, isComplete]);

  const mobileControls = (
    <div className="flex justify-center">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShuffle}
        disabled={isComplete}
        className="text-white border-white/30 hover:bg-white/20"
      >
        <Shuffle className="h-4 w-4 mr-2" />
        Shuffle
      </Button>
    </div>
  );

  return (
    <GameEngine
      gameId="enhanced-puzzle"
      title="15-Puzzle"
      description="Slide the numbered tiles to arrange them in order"
      gameState={gameState}
      onStateChange={updateGameState}
      onRestart={handleRestart}
      onExit={onClose}
      controls={mobileControls}
      soundEnabled={soundEnabled}
      onSoundToggle={toggleSound}
      showLives={false}
      customStats={[
        { label: 'Moves', value: moves },
        { label: 'Best', value: 'TBD' }
      ]}
    >
      <div className="flex items-center justify-center h-full bg-gray-900">
        <canvas
          ref={canvasRef}
          width={400}
          height={400}
          className="border-2 border-gray-600 cursor-pointer max-w-[90vw] max-h-[60vh]"
          onClick={handleTileClick}
          onTouchStart={handleTouchStart}
          style={{ 
            imageRendering: 'pixelated',
            width: 'min(400px, 90vw)',
            height: 'min(400px, 60vh)'
          }}
        />
      </div>
    </GameEngine>
  );
};

export default EnhancedPuzzleGame;
