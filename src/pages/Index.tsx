
import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { Gamepad2, Sparkles } from 'lucide-react';

// Lazy load heavy components for better performance
const EnhancedWorkingGamesSection = lazy(() => import('@/components/EnhancedWorkingGamesSection'));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="relative">
      <Gamepad2 className="h-16 w-16 text-primary animate-bounce" />
      <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
    </div>
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
      <section className="pt-20 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              UniGames
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            🎮 The ultimate collection of browser games. Play instantly, no downloads required.
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              ✅ 100% Working Games
            </div>
            <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              📱 Mobile Optimized
            </div>
            <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              ⚡ Instant Load
            </div>
            <div className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium">
              🎮 No Downloads
            </div>
          </div>

          {/* Call to Action */}
          <button className="bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity">
            <Gamepad2 className="h-5 w-5 inline mr-2" />
            Start Playing Now!
          </button>
        </div>
      </section>

      {/* Games Section */}
      <Suspense fallback={<LoadingFallback />}>
        <EnhancedWorkingGamesSection />
      </Suspense>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose UniGames?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-4">Lightning Fast</h3>
              <p className="text-muted-foreground">Optimized for instant gameplay with no waiting</p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold mb-4">Mobile Ready</h3>
              <p className="text-muted-foreground">Perfect controls for all devices and screen sizes</p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Zero Friction</h3>
              <p className="text-muted-foreground">Click and play immediately - no barriers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 border-t">
        <div className="container mx-auto max-w-6xl text-center">
          <p className="text-muted-foreground">
            &copy; 2024 UniGames. Built for gamers, by gamers.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
