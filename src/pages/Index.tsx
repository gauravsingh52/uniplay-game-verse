import { lazy, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import { Gamepad2, Sparkles, Zap, Star } from 'lucide-react';

// Lazy load heavy components for better performance
const EnhancedWorkingGamesSection = lazy(() => import('@/components/EnhancedWorkingGamesSection'));

const LoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
    <div className="relative">
      <Gamepad2 className="h-16 w-16 text-unigames-purple animate-bounce" />
      <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
    </div>
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
        Loading Epic Games...
      </h3>
      <p className="text-muted-foreground animate-pulse">Preparing your ultimate gaming experience</p>
    </div>
  </div>
);

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-unigames-purple/10 to-unigames-blue/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-unigames-blue/10 to-purple-500/10 rounded-full blur-2xl animate-float delay-300"></div>
        <div className="absolute bottom-20 left-1/3 w-56 h-56 bg-gradient-to-r from-pink-500/10 to-unigames-purple/10 rounded-full blur-3xl animate-float delay-500"></div>
      </div>

      <Navbar />
      
      {/* Enhanced Hero Section */}
      <section className="relative pt-20 pb-16 px-4 md:px-8">
        <div className="container mx-auto max-w-7xl text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            {/* Animated Title */}
            <div className="mb-8 relative">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 relative">
                <span className="bg-gradient-to-r from-unigames-purple via-unigames-blue to-purple-500 bg-clip-text text-transparent animate-pulse">
                  UniGames
                </span>
                <div className="absolute -top-4 -right-4">
                  <Star className="h-8 w-8 text-yellow-400 animate-spin" />
                </div>
                <div className="absolute -bottom-2 left-1/4">
                  <Zap className="h-6 w-6 text-blue-400 animate-bounce" />
                </div>
              </h1>
              
              {/* Glowing Effect Behind Title */}
              <div className="absolute inset-0 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 blur-3xl -z-10 animate-pulse"></div>
            </div>

            <p className="text-xl md:text-3xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
              🎮 The <span className="text-unigames-purple font-bold">ultimate</span> collection of browser games. 
              Play instantly, no downloads required. 
              <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                Optimized for mobile and desktop
              </span> with blazing-fast performance! ⚡
            </p>

            {/* Enhanced Feature Badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="group relative">
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    ✅ 100% Working Games
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>

              <div className="group relative">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                  📱 Mobile Optimized
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>

              <div className="group relative">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 animate-pulse" />
                    ⚡ Instant Load
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>

              <div className="group relative">
                <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer">
                  🎮 No Downloads
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Call to Action with Animation */}
            <div className="relative inline-block">
              <button className="group relative bg-gradient-to-r from-unigames-purple to-unigames-blue text-white px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <Gamepad2 className="h-5 w-5 animate-bounce" />
                  Start Playing Now!
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-unigames-blue to-unigames-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </button>
              <div className="absolute inset-0 bg-gradient-to-r from-unigames-purple to-unigames-blue rounded-xl blur-xl opacity-60 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section with Enhanced Loading */}
      <Suspense fallback={<LoadingFallback />}>
        <EnhancedWorkingGamesSection />
      </Suspense>

      {/* Enhanced Performance Features Section */}
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-unigames-purple/5 via-transparent to-unigames-blue/5 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-unigames-purple/10 to-transparent animate-pulse"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            <span className="bg-gradient-to-r from-unigames-purple via-unigames-blue to-purple-500 bg-clip-text text-transparent">
              🚀 Built for Speed & Performance
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 animate-bounce">⚡</div>
                <h3 className="text-xl font-bold mb-4 text-yellow-600">Lightning Fast</h3>
                <p className="text-muted-foreground leading-relaxed">Optimized loading with code-splitting and lazy loading for instant gameplay experience</p>
              </div>
            </div>

            <div className="group text-center p-8 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 animate-pulse">📱</div>
                <h3 className="text-xl font-bold mb-4 text-blue-600">Mobile First</h3>
                <p className="text-muted-foreground leading-relaxed">Touch-optimized controls with responsive design for all screen sizes and devices</p>
              </div>
            </div>

            <div className="group text-center p-8 bg-background/80 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-6xl mb-6 animate-spin-slow">🎯</div>
                <h3 className="text-xl font-bold mb-4 text-purple-600">Zero Friction</h3>
                <p className="text-muted-foreground leading-relaxed">No signups, downloads, or waiting. Click and play immediately with seamless experience</p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                18+
              </div>
              <p className="text-sm text-muted-foreground">Working Games</p>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {"<1s"}
              </div>
              <p className="text-sm text-muted-foreground">Load Time</p>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <p className="text-sm text-muted-foreground">Mobile Ready</p>
            </div>
            <div className="group">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                0MB
              </div>
              <p className="text-sm text-muted-foreground">Downloads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-12 px-4 md:px-8 border-t border-border/50 bg-gradient-to-r from-background via-muted/20 to-background relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-unigames-purple/5 to-transparent"></div>
        <div className="container mx-auto max-w-7xl text-center relative z-10">
          <div className="mb-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
              UniGames
            </span>
          </div>
          <p className="text-muted-foreground mb-4">
            &copy; 2024 UniGames. All rights reserved. Built for speed and performance with ❤️
          </p>
          <div className="flex justify-center space-x-6 text-sm text-muted-foreground">
            <span className="hover:text-unigames-purple transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-unigames-purple transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-unigames-purple transition-colors cursor-pointer">Support</span>
            <span className="hover:text-unigames-purple transition-colors cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
