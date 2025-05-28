
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, X, Heart } from "lucide-react";

interface BrickBreakerGameProps {
  onClose: () => void;
}

const BrickBreakerGame = ({ onClose }: BrickBreakerGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const gameStateRef = useRef({
    ball: { x: 400, y: 350, dx: 5, dy: -5, radius: 8 },
    paddle: { x: 350, y: 380, width: 100, height: 10, speed: 8 },
    bricks: [] as Array<{ x: number; y: number; width: number; height: number; destroyed: boolean; color: string }>,
    canvasWidth: 800,
    canvasHeight: 400,
    mouseX: 350
  });

  const initializeBricks = useCallback(() => {
    const bricks = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 10; col++) {
        bricks.push({
          x: col * 80 + 10,
          y: row * 30 + 50,
          width: 70,
          height: 25,
          destroyed: false,
          color: colors[row]
        });
      }
    }
    gameStateRef.current.bricks = bricks;
  }, []);

  const resetGame = useCallback(() => {
    const gameState = gameStateRef.current;
    gameState.ball.x = gameState.canvasWidth / 2;
    gameState.ball.y = 350;
    gameState.ball.dx = 5;
    gameState.ball.dy = -5;
    gameState.paddle.x = 350;
    setScore(0);
    setLives(3);
    setGameOver(false);
    setWon(false);
    initializeBricks();
  }, [initializeBricks]);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;
    const { ball, paddle, bricks, canvasWidth, canvasHeight } = gameState;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with walls
    if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvasWidth) {
      ball.dx = -ball.dx;
    }
    if (ball.y - ball.radius <= 0) {
      ball.dy = -ball.dy;
    }

    // Ball collision with paddle
    if (ball.y + ball.radius >= paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width) {
      ball.dy = -Math.abs(ball.dy);
      // Add some angle based on where it hits the paddle
      const hitPos = (ball.x - paddle.x) / paddle.width;
      ball.dx = (hitPos - 0.5) * 10;
    }

    // Ball falls below paddle
    if (ball.y > canvasHeight) {
      setLives(prev => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setGameOver(true);
          setIsPlaying(false);
        } else {
          ball.x = canvasWidth / 2;
          ball.y = 350;
          ball.dx = 5;
          ball.dy = -5;
          paddle.x = 350;
        }
        return newLives;
      });
    }

    // Ball collision with bricks
    bricks.forEach(brick => {
      if (!brick.destroyed &&
          ball.x + ball.radius >= brick.x &&
          ball.x - ball.radius <= brick.x + brick.width &&
          ball.y + ball.radius >= brick.y &&
          ball.y - ball.radius <= brick.y + brick.height) {
        brick.destroyed = true;
        ball.dy = -ball.dy;
        setScore(prev => prev + 10);
      }
    });

    // Check if all bricks are destroyed
    if (bricks.every(brick => brick.destroyed)) {
      setWon(true);
      setIsPlaying(false);
    }

    // Update paddle position
    paddle.x = gameState.mouseX - paddle.width / 2;
    paddle.x = Math.max(0, Math.min(canvasWidth - paddle.width, paddle.x));

    // Draw ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw paddle
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Draw bricks
    bricks.forEach(brick => {
      if (!brick.destroyed) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
        ctx.strokeStyle = '#000';
        ctx.strokeRect(brick.x, brick.y, brick.width, brick.height);
      }
    });

    if (isPlaying && !gameOver && !won) {
      animationRef.current = requestAnimationFrame(updateGame);
    }
  }, [isPlaying, gameOver, won]);

  useEffect(() => {
    initializeBricks();
  }, [initializeBricks]);

  useEffect(() => {
    if (isPlaying) {
      updateGame();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, updateGame]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      gameStateRef.current.mouseX = (e.clientX - rect.left) * scaleX;
    };

    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      return () => canvas.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const toggleGame = () => {
    if (gameOver || won) {
      resetGame();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">Score: {score}</div>
          <div className="flex items-center gap-1">
            {Array.from({ length: lives }).map((_, i) => (
              <Heart key={i} className="h-4 w-4 fill-red-500 text-red-500" />
            ))}
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
            width={800}
            height={400}
            className="border border-gray-300 rounded-lg mb-6 cursor-none"
            style={{ maxWidth: '100%', height: 'auto' }}
          />

          {(gameOver || won) && (
            <div className="text-center mb-6">
              <h3 className={`text-xl font-bold mb-2 ${won ? 'text-green-500' : 'text-red-500'}`}>
                {won ? 'You Won!' : 'Game Over!'}
              </h3>
              <p className="text-sm text-muted-foreground">Final Score: {score}</p>
            </div>
          )}

          <div className="flex gap-2 mb-4">
            <Button onClick={toggleGame} variant="outline">
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {gameOver || won ? 'New Game' : isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={resetGame} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Move your mouse to control the paddle</p>
            <p>Break all bricks to win!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrickBreakerGame;
