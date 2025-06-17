
import React, { useState, useEffect, useCallback, useRef } from 'react';
import GameEngine from '@/components/gameEngine/GameEngine';
import { useGameEngine } from '@/components/gameEngine/useGameEngine';
import { Button } from "@/components/ui/button";
import { RotateCw, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface Position {
  x: number;
  y: number;
}

interface Piece {
  shape: number[][];
  position: Position;
  color: string;
}

interface TetrisGameProps {
  onClose: () => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 30;

// Tetris pieces
const PIECES = [
  { shape: [[1, 1, 1, 1]], color: '#00f0f0' }, // I
  { shape: [[1, 1], [1, 1]], color: '#f0f000' }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' }, // T
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' }, // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' }, // Z
  { shape: [[1, 0, 0], [1, 1,1]], color: '#0000f0' }, // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#f0a000' }  // L
];

const EnhancedTetrisGame: React.FC<TetrisGameProps> = ({ onClose }) => {
  const { gameState, updateGameState, restartGame, addScore, playSound, soundEnabled, toggleSound } = useGameEngine({
    gameId: 'enhanced-tetris',
    initialLives: 1,
    levelUpScore: 1000
  });

  const [board, setBoard] = useState<string[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [linesCleared, setLinesCleared] = useState(0);
  
  const gameLoopRef = useRef<number>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate random piece
  const generatePiece = useCallback((): Piece => {
    const template = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
      shape: template.shape,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
      color: template.color
    };
  }, []);

  // Initialize pieces
  useEffect(() => {
    if (!currentPiece && !nextPiece) {
      setCurrentPiece(generatePiece());
      setNextPiece(generatePiece());
    }
  }, [currentPiece, nextPiece, generatePiece]);

  // Check collision
  const checkCollision = useCallback((piece: Piece, board: string[][], offset: Position = { x: 0, y: 0 }) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = piece.position.x + x + offset.x;
          const newY = piece.position.y + y + offset.y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  // Rotate piece
  const rotatePiece = useCallback((piece: Piece): Piece => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  }, []);

  // Clear completed lines
  const clearLines = useCallback((board: string[][]) => {
    const newBoard = board.filter(row => row.some(cell => !cell));
    const clearedLines = BOARD_HEIGHT - newBoard.length;
    
    if (clearedLines > 0) {
      const emptyRows = Array(clearedLines).fill(null).map(() => Array(BOARD_WIDTH).fill(''));
      playSound(600, 200);
      setLinesCleared(prev => prev + clearedLines);
      
      // Scoring based on lines cleared
      const scoreMultiplier = [0, 40, 100, 300, 1200];
      addScore(scoreMultiplier[clearedLines] * (gameState.level));
      
      return [...emptyRows, ...newBoard];
    }
    
    return board;
  }, [playSound, addScore, gameState.level]);

  // Place piece on board
  const placePiece = useCallback((piece: Piece, board: string[][]) => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.position.y + y;
          const boardX = piece.position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
    
    return clearLines(newBoard);
  }, [clearLines]);

  // Move piece down
  const movePieceDown = useCallback(() => {
    if (!currentPiece || !gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    if (!checkCollision(currentPiece, board, { x: 0, y: 1 })) {
      setCurrentPiece(prev => prev ? { ...prev, position: { ...prev.position, y: prev.position.y + 1 } } : null);
    } else {
      // Piece has landed
      playSound(300, 100);
      const newBoard = placePiece(currentPiece, board);
      setBoard(newBoard);
      
      // Check game over
      if (currentPiece.position.y <= 1) {
        playSound(200, 500);
        updateGameState({ isGameOver: true });
        return;
      }
      
      // Spawn next piece
      setCurrentPiece(nextPiece);
      setNextPiece(generatePiece());
    }
  }, [currentPiece, board, gameState.isPlaying, gameState.isPaused, gameState.isGameOver, checkCollision, placePiece, nextPiece, generatePiece, playSound, updateGameState]);

  // Game loop
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
      const speed = Math.max(50, 800 - (gameState.level - 1) * 50);
      gameLoopRef.current = window.setInterval(movePieceDown, speed);
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
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameState.level, movePieceDown]);

  // Move piece
  const movePiece = useCallback((direction: 'left' | 'right' | 'down') => {
    if (!currentPiece || !gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    const offset = {
      left: { x: -1, y: 0 },
      right: { x: 1, y: 0 },
      down: { x: 0, y: 1 }
    }[direction];

    if (!checkCollision(currentPiece, board, offset)) {
      setCurrentPiece(prev => prev ? {
        ...prev,
        position: {
          x: prev.position.x + offset.x,
          y: prev.position.y + offset.y
        }
      } : null);
    }
  }, [currentPiece, board, gameState.isPlaying, gameState.isPaused, gameState.isGameOver, checkCollision]);

  // Rotate current piece
  const handleRotate = useCallback(() => {
    if (!currentPiece || !gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    const rotated = rotatePiece(currentPiece);
    if (!checkCollision(rotated, board)) {
      setCurrentPiece(rotated);
      playSound(400, 50);
    }
  }, [currentPiece, board, gameState.isPlaying, gameState.isPaused, gameState.isGameOver, rotatePiece, checkCollision, playSound]);

  // Keyboard controls
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (!gameState.isPlaying || gameState.isPaused || gameState.isGameOver) return;

    switch (event.key) {
      case 'ArrowLeft':
      case 'a':
      case 'A':
        event.preventDefault();
        movePiece('left');
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        event.preventDefault();
        movePiece('right');
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        event.preventDefault();
        movePiece('down');
        addScore(1);
        break;
      case 'ArrowUp':
      case 'w':
      case 'W':
      case ' ':
        event.preventDefault();
        handleRotate();
        break;
    }
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, movePiece, handleRotate, addScore]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Restart game
  const handleRestart = () => {
    restartGame();
    setBoard(Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill('')));
    setCurrentPiece(generatePiece());
    setNextPiece(generatePiece());
    setLinesCleared(0);
  };

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x]) {
          ctx.fillStyle = board[y][x];
          ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
        }
      }
    }

    // Draw current piece
    if (currentPiece) {
      ctx.fillStyle = currentPiece.color;
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const drawX = (currentPiece.position.x + x) * BLOCK_SIZE;
            const drawY = (currentPiece.position.y + y) * BLOCK_SIZE;
            ctx.fillRect(drawX, drawY, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
          }
        }
      }
    }

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * BLOCK_SIZE, 0);
      ctx.lineTo(x * BLOCK_SIZE, BOARD_HEIGHT * BLOCK_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * BLOCK_SIZE);
      ctx.lineTo(BOARD_WIDTH * BLOCK_SIZE, y * BLOCK_SIZE);
      ctx.stroke();
    }
  }, [board, currentPiece]);

  const mobileControls = (
    <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto">
      <Button
        variant="outline"
        size="sm"
        onClick={() => movePiece('left')}
        className="text-white border-white/30 hover:bg-white/20"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRotate}
        className="text-white border-white/30 hover:bg-white/20"
      >
        <RotateCw className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => movePiece('right')}
        className="text-white border-white/30 hover:bg-white/20"
      >
        <ArrowRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => movePiece('down')}
        className="text-white border-white/30 hover:bg-white/20"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <GameEngine
      gameId="enhanced-tetris"
      title="Enhanced Tetris"
      description="Classic Tetris with modern features and responsive controls"
      gameState={gameState}
      onStateChange={updateGameState}
      onRestart={handleRestart}
      onExit={onClose}
      controls={mobileControls}
      soundEnabled={soundEnabled}
      onSoundToggle={toggleSound}
      showLives={false}
      customStats={[
        { label: 'Lines', value: linesCleared }
      ]}
    >
      <div className="flex items-center justify-center h-full bg-gray-900">
        <div className="flex gap-8 items-start">
          {/* Game Board */}
          <canvas
            ref={canvasRef}
            width={BOARD_WIDTH * BLOCK_SIZE}
            height={BOARD_HEIGHT * BLOCK_SIZE}
            className="border-2 border-gray-600 bg-black"
            style={{ imageRendering: 'pixelated' }}
          />
          
          {/* Next Piece Preview */}
          <div className="bg-black border-2 border-gray-600 p-4 min-w-[120px]">
            <div className="text-white text-sm mb-2 text-center">Next</div>
            <div className="w-16 h-16 mx-auto bg-gray-800 flex items-center justify-center">
              {nextPiece && (
                <div className="grid gap-px" style={{ 
                  gridTemplateColumns: `repeat(${nextPiece.shape[0].length}, 1fr)`,
                  gridTemplateRows: `repeat(${nextPiece.shape.length}, 1fr)`
                }}>
                  {nextPiece.shape.map((row, y) =>
                    row.map((cell, x) => (
                      <div
                        key={`${y}-${x}`}
                        className="w-3 h-3"
                        style={{ 
                          backgroundColor: cell ? nextPiece.color : 'transparent' 
                        }}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GameEngine>
  );
};

export default EnhancedTetrisGame;
