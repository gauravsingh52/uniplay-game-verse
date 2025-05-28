import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Pause, RotateCcw, X, Smartphone, Monitor } from "lucide-react";

interface PongGameProps {
  onClose: () => void;
}

const PongGame = ({ onClose }: PongGameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });
  const [isMobile, setIsMobile] = useState(false);

  // Responsive canvas sizing
  useEffect(() => {
    const updateCanvasSize = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Maintain 2:1 aspect ratio
        let width = Math.min(containerWidth - 32, 800);
        let height = width / 2;
        
        // Adjust for mobile
        if (window.innerWidth < 768) {
          width = Math.min(containerWidth - 16, 600);
          height = width / 1.5; // Slightly taller for mobile
          setIsMobile(true);
        } else {
          setIsMobile(false);
        }
        
        // Ensure minimum size
        width = Math.max(width, 300);
        height = Math.max(height, 200);
        
        setCanvasSize({ width, height });
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  const gameStateRef = useRef({
    ball: { x: 400, y: 200, dx: 5, dy: 3, radius: 8 },
    playerPaddle: { x: 20, y: 150, width: 10, height: 100, speed: 8 },
    aiPaddle: { x: 770, y: 150, width: 10, height: 100, speed: 6 },
    canvasWidth: 800,
    canvasHeight: 400
  });

  // Update game state when canvas size changes
  useEffect(() => {
    const gameState = gameStateRef.current;
    gameState.canvasWidth = canvasSize.width;
    gameState.canvasHeight = canvasSize.height;
    
    // Scale paddle sizes for mobile
    const paddleScale = isMobile ? 0.8 : 1;
    gameState.playerPaddle.width = 10 * paddleScale;
    gameState.playerPaddle.height = 100 * paddleScale;
    gameState.aiPaddle.width = 10 * paddleScale;
    gameState.aiPaddle.height = 100 * paddleScale;
    
    // Reposition paddles
    gameState.playerPaddle.x = 20;
    gameState.aiPaddle.x = canvasSize.width - 30;
    
    // Scale ball
    gameState.ball.radius = isMobile ? 6 : 8;
    
    resetBall();
  }, [canvasSize, isMobile]);

  const resetBall = useCallback(() => {
    const gameState = gameStateRef.current;
    gameState.ball.x = gameState.canvasWidth / 2;
    gameState.ball.y = gameState.canvasHeight / 2;
    gameState.ball.dx = (Math.random() > 0.5 ? 1 : -1) * (isMobile ? 3 : 5);
    gameState.ball.dy = (Math.random() - 0.5) * (isMobile ? 4 : 6);
  }, [isMobile]);

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
    ctx.lineWidth = 2;
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
        ball.y <= playerPaddle.y + playerPaddle.height &&
        ball.dx < 0) {
      ball.dx = Math.abs(ball.dx);
      ball.dy += (Math.random() - 0.5) * 2;
    }

    if (ball.x + ball.radius >= aiPaddle.x &&
        ball.y >= aiPaddle.y &&
        ball.y <= aiPaddle.y + aiPaddle.height &&
        ball.dx > 0) {
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
    const aiSpeed = isMobile ? 4 : 6;
    if (aiCenter < ball.y - 35) {
      aiPaddle.y += aiSpeed;
    } else if (aiCenter > ball.y + 35) {
      aiPaddle.y -= aiSpeed;
    }

    // Keep paddles in bounds
    playerPaddle.y = Math.max(0, Math.min(canvasHeight - playerPaddle.height, playerPaddle.y));
    aiPaddle.y = Math.max(0, Math.min(canvasHeight - aiPaddle.height, aiPaddle.y));

    // Draw ball with glow effect
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw paddles with gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    gradient.addColorStop(0, '#8b5cf6');
    gradient.addColorStop(1, '#3b82f6');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(updateGame);
    }
  }, [isPlaying, resetBall, isMobile]);

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

  // Touch controls for mobile
  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      if (!isPlaying || !isMobile) return;
      e.preventDefault();
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const touchY = touch.clientY - rect.top;
      const relativeY = (touchY / rect.height) * canvasSize.height;
      
      const gameState = gameStateRef.current;
      gameState.playerPaddle.y = Math.max(0, Math.min(canvasSize.height - gameState.playerPaddle.height, relativeY - gameState.playerPaddle.height / 2));
    };

    const canvas = canvasRef.current;
    if (canvas && isMobile) {
      canvas.addEventListener('touchmove', handleTouch, { passive: false });
      canvas.addEventListener('touchstart', handleTouch, { passive: false });
      return () => {
        canvas.removeEventListener('touchmove', handleTouch);
        canvas.removeEventListener('touchstart', handleTouch);
      };
    }
  }, [isPlaying, isMobile, canvasSize]);

  // Keyboard controls for desktop
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!isPlaying || isMobile) return;
      
      const gameState = gameStateRef.current;
      const { playerPaddle, canvasHeight } = gameState;
      const speed = 12;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          playerPaddle.y = Math.max(0, playerPaddle.y - speed);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          playerPaddle.y = Math.min(canvasHeight - playerPaddle.height, playerPaddle.y + speed);
          break;
      }
    };

    if (!isMobile) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [isPlaying, isMobile]);

  const toggleGame = () => {
    setIsPlaying(!isPlaying);
  };

  const resetGame = () => {
    setIsPlaying(false);
    setScore({ player: 0, ai: 0 });
    resetBall();
    const gameState = gameStateRef.current;
    gameState.playerPaddle.y = gameState.canvasHeight / 2 - gameState.playerPaddle.height / 2;
    gameState.aiPaddle.y = gameState.canvasHeight / 2 - gameState.aiPaddle.height / 2;
  };

  return (
    <div className="flex flex-col h-full p-2 sm:p-4 md:p-6" ref={containerRef}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">
            Player: {score.player} | AI: {score.ai}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {isMobile ? <Smartphone className="h-4 w-4" /> : <Monitor className="h-4 w-4" />}
            <span>{isMobile ? 'Touch Mode' : 'Keyboard Mode'}</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 md:p-6">
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            className="border border-gray-300 rounded-lg mb-4 md:mb-6 max-w-full touch-none"
            style={{ 
              width: `${canvasSize.width}px`, 
              height: `${canvasSize.height}px`,
              maxWidth: '100%',
              height: 'auto'
            }}
          />

          <div className="flex gap-2 mb-4">
            <Button onClick={toggleGame} variant="outline" size={isMobile ? "sm" : "default"}>
              {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button onClick={resetGame} variant="outline" size={isMobile ? "sm" : "default"}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            {isMobile ? (
              <>
                <p>Touch the screen to move your paddle</p>
                <p>First to score 10 points wins!</p>
              </>
            ) : (
              <>
                <p>Use Arrow Keys or W/S to move your paddle</p>
                <p>First to score 10 points wins!</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PongGame;
