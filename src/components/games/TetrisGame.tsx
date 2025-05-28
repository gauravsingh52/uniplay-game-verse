import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, X } from "lucide-react";

interface TetrisGameProps {
  onClose: () => void;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;

const PIECES = [
  { shape: [[1, 1, 1, 1]], color: '#00f0f0' }, // I
  { shape: [[1, 1], [1, 1]], color: '#f0f000' }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#a000f0' }, // T
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#00f000' }, // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#f00000' }, // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#f0a000' }, // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#0000f0' }, // L
];

const TetrisGame = ({ onClose }: TetrisGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const gameStateRef = useRef({
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0)),
    currentPiece: null as any,
    currentX: 0,
    currentY: 0,
    dropTime: 0,
    dropCounter: 0
  });

  const createPiece = useCallback(() => {
    const piece = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
      ...piece,
      shape: piece.shape.map(row => [...row])
    };
  }, []);

  const rotatePiece = (piece: any) => {
    const rotated = piece.shape[0].map((_: any, index: number) =>
      piece.shape.map((row: any) => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  };

  const isValidMove = useCallback((piece: any, x: number, y: number, board: number[][]) => {
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px]) {
          const newX = x + px;
          const newY = y + py;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const placePiece = useCallback((piece: any, x: number, y: number, board: number[][]) => {
    const newBoard = board.map(row => [...row]);
    
    for (let py = 0; py < piece.shape.length; py++) {
      for (let px = 0; px < piece.shape[py].length; px++) {
        if (piece.shape[py][px]) {
          const newY = y + py;
          if (newY >= 0) {
            newBoard[newY][x + px] = 1;
          }
        }
      }
    }
    
    return newBoard;
  }, []);

  const clearLines = useCallback((board: number[][]) => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    if (linesCleared > 0) {
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(prev => Math.floor((lines + linesCleared) / 10) + 1);
    }
    
    return newBoard;
  }, [level, lines]);

  const spawnPiece = useCallback(() => {
    const piece = createPiece();
    const x = Math.floor(BOARD_WIDTH / 2) - Math.floor(piece.shape[0].length / 2);
    const y = 0;
    
    if (!isValidMove(piece, x, y, gameStateRef.current.board)) {
      setGameOver(true);
      setIsPlaying(false);
      return;
    }
    
    gameStateRef.current.currentPiece = piece;
    gameStateRef.current.currentX = x;
    gameStateRef.current.currentY = y;
  }, [createPiece, isValidMove]);

  const movePiece = useCallback((dx: number, dy: number) => {
    const gameState = gameStateRef.current;
    const newX = gameState.currentX + dx;
    const newY = gameState.currentY + dy;
    
    if (isValidMove(gameState.currentPiece, newX, newY, gameState.board)) {
      gameState.currentX = newX;
      gameState.currentY = newY;
      return true;
    }
    
    return false;
  }, [isValidMove]);

  const dropPiece = useCallback(() => {
    if (!movePiece(0, 1)) {
      const gameState = gameStateRef.current;
      gameState.board = placePiece(
        gameState.currentPiece,
        gameState.currentX,
        gameState.currentY,
        gameState.board
      );
      gameState.board = clearLines(gameState.board);
      spawnPiece();
    }
  }, [movePiece, placePiece, clearLines, spawnPiece]);

  const rotatePieceInGame = useCallback(() => {
    const gameState = gameStateRef.current;
    const rotated = rotatePiece(gameState.currentPiece);
    
    if (isValidMove(rotated, gameState.currentX, gameState.currentY, gameState.board)) {
      gameState.currentPiece = rotated;
    }
  }, [isValidMove]);

  const hardDrop = useCallback(() => {
    while (movePiece(0, 1)) {
      // Keep dropping until we can't
    }
    dropPiece();
  }, [movePiece, dropPiece]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameState = gameStateRef.current;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw board
    ctx.strokeStyle = '#333';
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (gameState.board[y][x]) {
          ctx.fillStyle = '#666';
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        ctx.strokeRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
    
    // Draw current piece
    if (gameState.currentPiece) {
      ctx.fillStyle = gameState.currentPiece.color;
      for (let py = 0; py < gameState.currentPiece.shape.length; py++) {
        for (let px = 0; px < gameState.currentPiece.shape[py].length; px++) {
          if (gameState.currentPiece.shape[py][px]) {
            const x = (gameState.currentX + px) * CELL_SIZE;
            const y = (gameState.currentY + py) * CELL_SIZE;
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
          }
        }
      }
    }
  }, []);

  const gameLoop = useCallback((time: number) => {
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;
    
    const gameState = gameStateRef.current;
    gameState.dropCounter += deltaTime;
    
    const dropTime = 1000 - (level - 1) * 100;
    
    if (gameState.dropCounter > dropTime) {
      dropPiece();
      gameState.dropCounter = 0;
    }
    
    draw();
    
    if (isPlaying && !gameOver) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
  }, [isPlaying, gameOver, level, dropPiece, draw]);

  useEffect(() => {
    if (isPlaying && !gameOver) {
      if (!gameStateRef.current.currentPiece) {
        spawnPiece();
      }
      lastTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(gameLoop);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, gameOver, gameLoop, spawnPiece]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || gameOver) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          dropPiece();
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotatePieceInGame();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, gameOver, movePiece, dropPiece, rotatePieceInGame, hardDrop]);

  const resetGame = () => {
    gameStateRef.current.board = Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(0));
    gameStateRef.current.currentPiece = null;
    gameStateRef.current.dropCounter = 0;
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPlaying(false);
  };

  const toggleGame = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-sm">
            Score: {score} | Lines: {lines} | Level: {level}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
          <canvas
            ref={canvasRef}
            width={BOARD_WIDTH * CELL_SIZE}
            height={BOARD_HEIGHT * CELL_SIZE}
            className="border border-gray-300 rounded-lg mb-6"
            style={{ maxWidth: '100%', height: 'auto' }}
          />

          {gameOver && (
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-500 mb-2">Game Over!</h3>
              <p className="text-sm text-muted-foreground">Final Score: {score}</p>
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <Button onClick={toggleGame} variant="outline">
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Arrow keys to move, Up to rotate, Space to drop</p>
            <p>Clear lines to score points!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TetrisGame;
