
import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, X, Trophy } from "lucide-react";

interface Game2048Props {
  onClose: () => void;
}

type Board = number[][];

const Game2048 = ({ onClose }: Game2048Props) => {
  const [board, setBoard] = useState<Board>(() => initializeBoard());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  function initializeBoard(): Board {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addRandomTile(newBoard);
    addRandomTile(newBoard);
    return newBoard;
  }

  function addRandomTile(board: Board) {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }
    if (emptyCells.length > 0) {
      const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  const moveLeft = useCallback((board: Board) => {
    const newBoard = board.map(row => [...row]);
    let moved = false;
    let newScore = 0;

    for (let i = 0; i < 4; i++) {
      const row = newBoard[i].filter(val => val !== 0);
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          newScore += row[j];
          if (row[j] === 2048) setWon(true);
          row[j + 1] = 0;
        }
      }
      const newRow = row.filter(val => val !== 0);
      while (newRow.length < 4) {
        newRow.push(0);
      }
      
      if (JSON.stringify(newBoard[i]) !== JSON.stringify(newRow)) {
        moved = true;
      }
      newBoard[i] = newRow;
    }

    return { board: newBoard, moved, score: newScore };
  }, []);

  const rotateBoard = (board: Board) => {
    return board[0].map((_, index) => board.map(row => row[index]));
  };

  const handleMove = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    let currentBoard = [...board];
    let rotations = 0;

    switch (direction) {
      case 'right':
        rotations = 2;
        break;
      case 'up':
        rotations = 3;
        break;
      case 'down':
        rotations = 1;
        break;
    }

    for (let i = 0; i < rotations; i++) {
      currentBoard = rotateBoard(currentBoard);
    }

    const { board: newBoard, moved, score: addedScore } = moveLeft(currentBoard);

    for (let i = 0; i < (4 - rotations) % 4; i++) {
      currentBoard = rotateBoard(newBoard);
    }

    if (moved) {
      addRandomTile(currentBoard);
      setBoard(currentBoard);
      setScore(prev => prev + addedScore);

      if (!canMove(currentBoard)) {
        setGameOver(true);
      }
    }
  }, [board, gameOver, moveLeft]);

  const canMove = (board: Board) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return true;
        if (j < 3 && board[i][j] === board[i][j + 1]) return true;
        if (i < 3 && board[i][j] === board[i + 1][j]) return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handleMove('left');
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleMove('right');
          break;
        case 'ArrowUp':
          e.preventDefault();
          handleMove('up');
          break;
        case 'ArrowDown':
          e.preventDefault();
          handleMove('down');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleMove]);

  const resetGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
    setWon(false);
  };

  const getTileColor = (value: number) => {
    const colors: { [key: number]: string } = {
      2: 'bg-gray-100 text-gray-700',
      4: 'bg-gray-200 text-gray-700',
      8: 'bg-orange-200 text-white',
      16: 'bg-orange-300 text-white',
      32: 'bg-orange-400 text-white',
      64: 'bg-red-400 text-white',
      128: 'bg-yellow-400 text-white',
      256: 'bg-yellow-500 text-white',
      512: 'bg-yellow-600 text-white',
      1024: 'bg-purple-500 text-white',
      2048: 'bg-purple-600 text-white'
    };
    return colors[value] || 'bg-purple-700 text-white';
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Score: {score}</div>
          {won && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Trophy className="h-4 w-4" />
              <span>You Won!</span>
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="grid grid-cols-4 gap-2 p-4 bg-gray-300 rounded-lg mb-6">
            {board.map((row, i) =>
              row.map((cell, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`
                    w-16 h-16 rounded flex items-center justify-center font-bold text-sm
                    ${cell === 0 ? 'bg-gray-400' : getTileColor(cell)}
                    transition-all duration-200
                  `}
                >
                  {cell !== 0 && cell}
                </div>
              ))
            )}
          </div>

          {gameOver && (
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-red-500 mb-2">Game Over!</h3>
              <p className="text-sm text-muted-foreground">Final Score: {score}</p>
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Use arrow keys to move tiles</p>
            <p>Combine tiles with the same number to reach 2048!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Game2048;
