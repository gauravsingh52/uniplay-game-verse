
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Trophy, X, Clock } from "lucide-react";

interface MemoryMatchGameProps {
  onClose: () => void;
}

interface GameCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🎯', '🎲', '🎪', '🎨', '🎭', '🎸', '🎺'];

const MemoryMatchGame = ({ onClose }: MemoryMatchGameProps) => {
  const [cards, setCards] = useState<GameCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [timer, setTimer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [bestTime, setBestTime] = useState(() => {
    return parseInt(localStorage.getItem('memory-match-best-time') || '999');
  });

  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    const gameCards: GameCard[] = [];
    EMOJIS.forEach((emoji, index) => {
      gameCards.push(
        { id: index * 2, emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
      );
    });
    setCards(shuffleArray(gameCards));
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameWon(false);
    setTimer(0);
    setGameStarted(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStarted && !gameWon) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameWon]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      const firstCard = cards.find(card => card.id === first);
      const secondCard = cards.find(card => card.id === second);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isMatched: true, isFlipped: true }
              : card
          ));
          setMatches(prev => prev + 1);
          setFlippedCards([]);
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === first || card.id === second 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedCards, cards]);

  useEffect(() => {
    if (matches === EMOJIS.length) {
      setGameWon(true);
      if (timer < bestTime) {
        setBestTime(timer);
        localStorage.setItem('memory-match-best-time', timer.toString());
      }
    }
  }, [matches, timer, bestTime]);

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    
    if (flippedCards.length >= 2) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));
    setFlippedCards(prev => [...prev, cardId]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Moves: {moves}</div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatTime(timer)}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-600">
            <Trophy className="h-4 w-4" />
            <span>Best: {bestTime === 999 ? '--' : formatTime(bestTime)}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="grid grid-cols-4 gap-3 mb-6">
            {cards.map((card) => (
              <Button
                key={card.id}
                variant="outline"
                className={`
                  w-16 h-16 text-2xl font-bold border-2 transition-all duration-300
                  ${card.isFlipped || card.isMatched 
                    ? 'bg-blue-100 border-blue-300' 
                    : 'bg-gray-100 hover:bg-gray-200'
                  }
                  ${card.isMatched ? 'bg-green-100 border-green-300' : ''}
                `}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isFlipped || card.isMatched || flippedCards.length >= 2}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
              </Button>
            ))}
          </div>

          {gameWon && (
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-green-500 mb-2">Congratulations!</h3>
              <p className="text-muted-foreground mb-2">
                You won in {moves} moves and {formatTime(timer)}!
              </p>
              {timer === bestTime && timer < 999 && (
                <p className="text-yellow-600 font-semibold">🏆 New best time!</p>
              )}
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <Button onClick={initializeGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              New Game
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Click cards to flip them and find matching pairs</p>
            <p>Match all pairs in the fewest moves and time!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryMatchGame;
