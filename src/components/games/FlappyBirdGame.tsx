
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, RotateCcw, Trophy, X } from "lucide-react";

interface FlappyBirdGameProps {
  onClose: () => void;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

const GAME_WIDTH = 400;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 20;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const PIPE_SPEED = 2;

const FlappyBirdGame = ({ onClose }: FlappyBirdGameProps) => {
  const [birdY, setBirdY] = useState(GAME_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('flappy-bird-high-score') || '0');
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const gameLoopRef = useRef<number>();

  const resetGame = () => {
    setBirdY(GAME_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  };

  const jump = useCallback(() => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (!gameOver) {
      setBirdVelocity(JUMP_FORCE);
    }
  }, [gameStarted, gameOver]);

  const generatePipe = useCallback((x: number): Pipe => {
    const topHeight = Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50;
    return {
      x,
      topHeight,
      bottomHeight: GAME_HEIGHT - topHeight - PIPE_GAP,
      passed: false,
    };
  }, []);

  const gameLoop = useCallback(() => {
    if (!gameStarted || gameOver) return;

    // Update bird physics
    setBirdVelocity(prev => prev + GRAVITY);
    setBirdY(prev => {
      const newY = prev + birdVelocity;
      
      // Check ground and ceiling collision
      if (newY <= 0 || newY >= GAME_HEIGHT - BIRD_SIZE) {
        setGameOver(true);
        return prev;
      }
      
      return newY;
    });

    // Update pipes
    setPipes(prevPipes => {
      let newPipes = [...prevPipes];
      
      // Move pipes
      newPipes = newPipes.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
      
      // Remove pipes that are off screen
      newPipes = newPipes.filter(pipe => pipe.x > -PIPE_WIDTH);
      
      // Add new pipes
      if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < GAME_WIDTH - 200) {
        newPipes.push(generatePipe(GAME_WIDTH));
      }
      
      // Check collisions and scoring
      newPipes.forEach(pipe => {
        const birdLeft = 50;
        const birdRight = birdLeft + BIRD_SIZE;
        const birdTop = birdY;
        const birdBottom = birdY + BIRD_SIZE;
        
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;
        
        // Check collision
        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          if (birdTop < pipe.topHeight || birdBottom > GAME_HEIGHT - pipe.bottomHeight) {
            setGameOver(true);
          }
        }
        
        // Check scoring
        if (!pipe.passed && pipe.x + PIPE_WIDTH < birdLeft) {
          pipe.passed = true;
          setScore(prev => {
            const newScore = prev + 1;
            if (newScore > highScore) {
              const newHighScore = newScore;
              setHighScore(newHighScore);
              localStorage.setItem('flappy-bird-high-score', newHighScore.toString());
            }
            return newScore;
          });
        }
      });
      
      return newPipes;
    });
  }, [gameStarted, gameOver, birdVelocity, birdY, generatePipe, highScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        jump();
      }
    };

    const handleClick = () => {
      jump();
    };

    window.addEventListener('keydown', handleKeyPress);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      window.removeEventListener('click', handleClick);
    };
  }, [jump]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
      const interval = setInterval(() => {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }, 1000 / 60); // 60 FPS
      
      return () => {
        clearInterval(interval);
        if (gameLoopRef.current) {
          cancelAnimationFrame(gameLoopRef.current);
        }
      };
    }
  }, [gameLoop, gameStarted, gameOver]);

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="flex items-center gap-1 text-yellow-600">
            <Trophy className="h-4 w-4" />
            <span>Best: {highScore}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
          <div 
            className="relative bg-gradient-to-b from-blue-400 to-blue-600 border-2 border-gray-700 rounded-lg overflow-hidden mb-4"
            style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}
          >
            {/* Bird */}
            <div
              className="absolute w-5 h-5 bg-yellow-400 rounded-full border-2 border-orange-400 transition-all duration-75"
              style={{
                left: '50px',
                top: `${birdY}px`,
                transform: `rotate(${Math.min(Math.max(birdVelocity * 3, -30), 30)}deg)`,
              }}
            />
            
            {/* Pipes */}
            {pipes.map((pipe, index) => (
              <div key={index}>
                {/* Top pipe */}
                <div
                  className="absolute bg-green-500 border-r-4 border-green-600"
                  style={{
                    left: `${pipe.x}px`,
                    top: '0px',
                    width: `${PIPE_WIDTH}px`,
                    height: `${pipe.topHeight}px`,
                  }}
                />
                {/* Bottom pipe */}
                <div
                  className="absolute bg-green-500 border-r-4 border-green-600"
                  style={{
                    left: `${pipe.x}px`,
                    bottom: '0px',
                    width: `${PIPE_WIDTH}px`,
                    height: `${pipe.bottomHeight}px`,
                  }}
                />
              </div>
            ))}
            
            {/* Ground */}
            <div className="absolute bottom-0 w-full h-4 bg-green-800" />
            
            {/* Game Over Overlay */}
            {gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-2xl font-bold mb-2">Game Over!</h3>
                  <p className="mb-4">Score: {score}</p>
                  <Button onClick={resetGame} className="bg-green-600 hover:bg-green-700">
                    Play Again
                  </Button>
                </div>
              </div>
            )}
            
            {/* Start Screen */}
            {!gameStarted && !gameOver && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <div className="text-center text-white">
                  <h3 className="text-xl font-bold mb-2">Flappy Bird</h3>
                  <p className="mb-4">Click or press Space to fly!</p>
                  <Button onClick={jump} className="bg-green-600 hover:bg-green-700">
                    <Play className="h-4 w-4 mr-2" />
                    Start
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-4">
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Click or press Space to make the bird fly</p>
            <p>Avoid the pipes and try to get the highest score!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlappyBirdGame;
