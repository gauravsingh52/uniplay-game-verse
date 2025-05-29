
import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { Gamepad2 } from 'lucide-react';

// Lazy load heavy components for better performance
const OptimizedWorkingGamesSection = lazy(() => import('@/components/OptimizedWorkingGamesSection'));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <Gamepad2 className="h-16 w-16 text-unigames-purple animate-pulse" />
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">Loading Games...</h3>
      <p className="text-muted-foreground">Preparing your gaming experience</p>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 md:px-8 bg-gradient-to-br from-unigames-purple/10 via-unigames-blue/10 to-background">
        <div className="container mx-auto max-w-7xl text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                UniGames
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The ultimate collection of browser games. Play instantly, no downloads required. 
              Optimized for mobile and desktop with blazing-fast performance.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="bg-green-500/20 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
                ✅ 100% Working Games
              </div>
              <div className="bg-blue-500/20 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                📱 Mobile Optimized
              </div>
              <div className="bg-purple-500/20 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
                ⚡ Instant Load
              </div>
              <div className="bg-orange-500/20 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                🎮 No Downloads
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section with Lazy Loading */}
      <Suspense fallback={<LoadingFallback />}>
        <OptimizedWorkingGamesSection />
      </Suspense>

      {/* Performance Features Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-unigames-purple/5 to-unigames-blue/5">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
              Built for Speed & Performance
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-background rounded-xl border">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground">Optimized loading with code-splitting and lazy loading for instant gameplay</p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl border">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-2">Mobile First</h3>
              <p className="text-muted-foreground">Touch-optimized controls with responsive design for all screen sizes</p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl border">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-2">Zero Friction</h3>
              <p className="text-muted-foreground">No signups, downloads, or waiting. Click and play immediately</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 border-t">
        <div className="container mx-auto max-w-7xl text-center text-muted-foreground">
          <p>&copy; 2024 UniGames. All rights reserved. Built for speed and performance.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
