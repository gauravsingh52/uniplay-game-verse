
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Trophy, X } from "lucide-react";

interface TicTacToeGameProps {
  onClose: () => void;
}

type Player = 'X' | 'O' | null;
type Board = Player[];

const TicTacToeGame = ({ onClose }: TicTacToeGameProps) => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [winner, setWinner] = useState<Player>(null);
  const [winCount, setWinCount] = useState({ X: 0, O: 0, draws: 0 });

  const checkWinner = (squares: Board): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return squares.every(square => square !== null) ? 'draw' as Player : null;
  };

  const handleClick = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setWinCount(prev => ({
        ...prev,
        [gameWinner === 'draw' ? 'draws' : gameWinner]: prev[gameWinner === 'draw' ? 'draws' : gameWinner] + 1
      }));
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinner(null);
  };

  const resetStats = () => {
    setWinCount({ X: 0, O: 0, draws: 0 });
    resetGame();
  };

  const renderSquare = (index: number) => {
    const value = board[index];
    return (
      <Button
        key={index}
        variant="outline"
        className={`
          w-20 h-20 text-2xl font-bold border-2 
          ${value === 'X' ? 'text-blue-600 bg-blue-50' : ''}
          ${value === 'O' ? 'text-red-600 bg-red-50' : ''}
          hover:bg-muted transition-colors
        `}
        onClick={() => handleClick(index)}
        disabled={!!board[index] || !!winner}
      >
        {value}
      </Button>
    );
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">
            Current Player: <span className={currentPlayer === 'X' ? 'text-blue-600' : 'text-red-600'}>{currentPlayer}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600">
            <Trophy className="h-4 w-4" />
            <span>X: {winCount.X} | O: {winCount.O} | Draws: {winCount.draws}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="grid grid-cols-3 gap-2 mb-6 p-4 bg-muted rounded-lg">
            {Array.from({ length: 9 }).map((_, index) => renderSquare(index))}
          </div>

          {winner && (
            <div className="text-center mb-6">
              {winner === 'draw' ? (
                <h3 className="text-xl font-bold text-orange-500 mb-2">It's a Draw!</h3>
              ) : (
                <h3 className="text-xl font-bold mb-2">
                  <span className={winner === 'X' ? 'text-blue-600' : 'text-red-600'}>
                    Player {winner} Wins!
                  </span>
                </h3>
              )}
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
            <Button onClick={resetStats} variant="outline">
              Reset Stats
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Click on a square to make your move</p>
            <p>Get three in a row to win!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TicTacToeGame;
