import { lazy, Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from 'lucide-react';

interface LazyGameLoaderProps {
  gameId: string;
  onClose: () => void;
}

// Lazy load game components for better performance
const gameComponentMap = {
  'bubble-bop': lazy(() => import('@/components/games/BubbleBopGame')),
  'zoo-zoom': lazy(() => import('@/components/games/ZooZoomGame')),
  'jelly-stack': lazy(() => import('@/components/games/JellyStackGame')),
  'snail-sprint': lazy(() => import('@/components/games/SnailSprintGame')),
  'plant-panic': lazy(() => import('@/components/games/PlantPanicGame')),
  'toast-escape': lazy(() => import('@/components/games/ToastEscapeGame')),
  'flap-n-nap': lazy(() => import('@/components/games/FlapNapGame')),
  'pixel-jumper': lazy(() => import('@/components/games/PixelJumperGame')),
  'cloud-hop': lazy(() => import('@/components/games/CloudHopGame')),
  'color-rush': lazy(() => import('@/components/games/ColorRushGame')),
  'snake': lazy(() => import('@/components/games/SnakeGame')),
  'flappy-bird': lazy(() => import('@/components/games/FlappyBirdGame')),
  'tic-tac-toe': lazy(() => import('@/components/games/TicTacToeGame')),
  'memory-match': lazy(() => import('@/components/games/MemoryMatchGame')),
  '2048': lazy(() => import('@/components/games/Game2048')),
  'pong': lazy(() => import('@/components/games/PongGame')),
  'brick-breaker': lazy(() => import('@/components/games/BrickBreakerGame')),
  'tetris': lazy(() => import('@/components/games/TetrisGame'))
};

const GameLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center h-full space-y-4">
    <Gamepad2 className="h-16 w-16 text-unigames-purple animate-pulse" />
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">Loading Game...</h3>
      <p className="text-muted-foreground">Please wait while we prepare your game</p>
    </div>
  </div>
);

export default function LazyGameLoader({ gameId, onClose }: LazyGameLoaderProps) {
  const GameComponent = gameComponentMap[gameId as keyof typeof gameComponentMap];

  if (!GameComponent) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Gamepad2 className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Game Not Available</h3>
          <p className="text-muted-foreground">This game is currently being developed</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<GameLoadingFallback />}>
      <GameComponent onClose={onClose} />
    </Suspense>
  );
}
