import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, X } from "lucide-react";

interface PongGameProps {
  onClose: () => void;
}

const PongGame = ({ onClose }: PongGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const gameStateRef = useRef({
    ball: { x: 400, y: 200, dx: 5, dy: 3, radius: 8 },
    playerPaddle: { x: 20, y: 150, width: 10, height: 100, speed: 8 },
    aiPaddle: { x: 770, y: 150, width: 10, height: 100, speed: 6 },
    canvasWidth: 800,
    canvasHeight: 400
  });

  const resetBall = useCallback(() => {
    const gameState = gameStateRef.current;
    gameState.ball.x = gameState.canvasWidth / 2;
    gameState.ball.y = gameState.canvasHeight / 2;
    gameState.ball.dx = Math.random() > 0.5 ? 5 : -5;
    gameState.ball.dy = (Math.random() - 0.5) * 6;
  }, []);

  const updateGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const gameState = gameStateRef.current;
    const { ball, playerPaddle, aiPaddle, canvasWidth, canvasHeight } = gameState;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw center line
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();
    ctx.setLineDash([]);

    // Update ball position
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom walls
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvasHeight) {
      ball.dy = -ball.dy;
    }

    // Ball collision with paddles
    if (ball.x - ball.radius <= playerPaddle.x + playerPaddle.width &&
        ball.y >= playerPaddle.y &&
        ball.y <= playerPaddle.y + playerPaddle.height) {
      ball.dx = Math.abs(ball.dx);
      ball.dy += (Math.random() - 0.5) * 2;
    }

    if (ball.x + ball.radius >= aiPaddle.x &&
        ball.y >= aiPaddle.y &&
        ball.y <= aiPaddle.y + aiPaddle.height) {
      ball.dx = -Math.abs(ball.dx);
      ball.dy += (Math.random() - 0.5) * 2;
    }

    // Score and reset
    if (ball.x < 0) {
      setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
      resetBall();
    } else if (ball.x > canvasWidth) {
      setScore(prev => ({ ...prev, player: prev.player + 1 }));
      resetBall();
    }

    // AI paddle movement
    const aiCenter = aiPaddle.y + aiPaddle.height / 2;
    if (aiCenter < ball.y - 35) {
      aiPaddle.y += aiPaddle.speed;
    } else if (aiCenter > ball.y + 35) {
      aiPaddle.y -= aiPaddle.speed;
    }

    // Keep paddles in bounds
    playerPaddle.y = Math.max(0, Math.min(canvasHeight - playerPaddle.height, playerPaddle.y));
    aiPaddle.y = Math.max(0, Math.min(canvasHeight - aiPaddle.height, aiPaddle.y));

    // Draw ball
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw paddles
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateGame);
    }
  }, [isPlaying, resetBall]);

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
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      const gameState = gameStateRef.current;
      const { playerPaddle, canvasHeight } = gameState;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          playerPaddle.y = Math.max(0, playerPaddle.y - playerPaddle.speed);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          playerPaddle.y = Math.min(canvasHeight - playerPaddle.height, playerPaddle.y + playerPaddle.speed);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying]);

  const toggleGame = () => {
    setIsPlaying(!isPlaying);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore({ player: 0, ai: 0 });
    resetBall();
    gameStateRef.current.playerPaddle.y = 150;
    gameStateRef.current.aiPaddle.y = 150;
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">
            Player: {score.player} | AI: {score.ai}
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
            className="border border-gray-300 rounded-lg mb-6"
            style={{ maxWidth: '100%', height: 'auto' }}
          />

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
            <p>Use Arrow Keys or W/S to move your paddle</p>
            <p>First to score 10 points wins!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PongGame;
