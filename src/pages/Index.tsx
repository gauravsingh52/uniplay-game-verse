import { useState, useEffect } from 'react';
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import EnhancedHeroSection from '@/components/EnhancedHeroSection';
import ModernGameCard from '@/components/ModernGameCard';
import EnhancedWorkingGamesSection from '@/components/EnhancedWorkingGamesSection';
import { UserProfileSystem } from '@/components/UserProfileSystem';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getFeaturedGames, getGamesByCategory, gamesData } from '@/data/gamesData';
import { workingGames, WorkingGame } from '@/data/workingGamesData';
import { ArrowRight, Gamepad, Star, Play, TrendingUp, X, Gift } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/hooks/useAuth';

// Import game components
import BubbleBopGame from '@/components/games/BubbleBopGame';
import SnakeGame from '@/components/games/SnakeGame';
import FlappyBirdGame from '@/components/games/FlappyBirdGame';
import TicTacToeGame from '@/components/games/TicTacToeGame';
import MemoryMatchGame from '@/components/games/MemoryMatchGame';
import Game2048 from '@/components/games/Game2048';
import PongGame from '@/components/games/PongGame';
import BrickBreakerGame from '@/components/games/BrickBreakerGame';
import TetrisGame from '@/components/games/TetrisGame';
import ZooZoomGame from '@/components/games/ZooZoomGame';
import JellyStackGame from '@/components/games/JellyStackGame';
import SnailSprintGame from '@/components/games/SnailSprintGame';
import PlantPanicGame from '@/components/games/PlantPanicGame';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredGames, setFilteredGames] = useState(gamesData.slice(0, 8));
  const [showNotification, setShowNotification] = useState(false);
  const [selectedGame, setSelectedGame] = useState<WorkingGame | null>(null);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const featuredGames = getFeaturedGames().slice(0, 6);
  const trendingGames = [...gamesData].sort((a, b) => b.rating - a.rating).slice(0, 6);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredGames(gamesData.slice(0, 8));
    } else {
      setFilteredGames(getGamesByCategory(selectedCategory).slice(0, 8));
    }
  }, [selectedCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayGame = (game: WorkingGame) => {
    setSelectedGame(game);
    setIsGameModalOpen(true);
  };

  const closeGameModal = () => {
    setIsGameModalOpen(false);
    setSelectedGame(null);
  };

  const renderGameComponent = () => {
    if (!selectedGame) return null;

    const gameComponents: { [key: string]: JSX.Element } = {
      'bubble-bop': <BubbleBopGame onClose={closeGameModal} />,
      'zoo-zoom': <ZooZoomGame onClose={closeGameModal} />,
      'jelly-stack': <JellyStackGame onClose={closeGameModal} />,
      'snail-sprint': <SnailSprintGame onClose={closeGameModal} />,
      'plant-panic': <PlantPanicGame onClose={closeGameModal} />,
      'snake': <SnakeGame onClose={closeGameModal} />,
      'flappy-bird': <FlappyBirdGame onClose={closeGameModal} />,
      'tic-tac-toe': <TicTacToeGame onClose={closeGameModal} />,
      'memory-match': <MemoryMatchGame onClose={closeGameModal} />,
      '2048': <Game2048 onClose={closeGameModal} />,
      'pong': <PongGame onClose={closeGameModal} />,
      'brick-breaker': <BrickBreakerGame onClose={closeGameModal} />,
      'tetris': <TetrisGame onClose={closeGameModal} />
    };

    return gameComponents[selectedGame.id] || (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <Gamepad className="h-16 w-16 text-muted-foreground" />
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">{selectedGame.title}</h3>
          <p className="text-muted-foreground mb-4">Game not available</p>
        </div>
      </div>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SidebarInset className="flex-1">
          <div className="flex flex-col min-h-screen">
            {isAuthenticated && (
              <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-border">
                <SidebarTrigger className="-mr-1" />
              </div>
            )}
            
            <ResponsiveNavbar />
            
            {/* Welcome Notification */}
            {showNotification && (
              <div className="fixed top-20 right-4 z-50 animate-slideInRight">
                <Card className="glass-effect shadow-2xl border border-unigames-purple/30">
                  <CardContent className="p-4 flex items-center gap-3">
                    <Gift className="h-5 w-5 text-unigames-purple" />
                    <div>
                      <p className="font-semibold text-gradient">Welcome to UNIGAMES!</p>
                      <p className="text-sm text-muted-foreground">Discover 30+ games with achievements!</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="hover:bg-unigames-purple/10"
                      onClick={() => setShowNotification(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {/* Enhanced Hero Section */}
            <EnhancedHeroSection />
            
            {/* Enhanced Working Games Section */}
            <section className="section-container bg-muted/30">
              <EnhancedWorkingGamesSection />
            </section>
            
            {/* User Profile Section */}
            <section className="section-container">
              <div className="container-responsive max-w-4xl">
                <UserProfileSystem />
              </div>
            </section>
            
            {/* Featured Games Section */}
            <section className="section-container bg-muted/30">
              <div className="container-responsive">
                <div className="text-center mb-12 animate-fadeIn">
                  <Badge className="mb-4 bg-unigames-purple/20 text-unigames-purple border-unigames-purple/30">
                    Featured Collection
                  </Badge>
                  <h2 className="text-responsive-2xl font-bold mb-4">
                    <span className="text-gradient">Premium Games</span>
                  </h2>
                  <p className="text-responsive-base text-muted-foreground max-w-2xl mx-auto">
                    Hand-picked games offering the best gaming experience
                  </p>
                  <div className="section-divider mt-6"></div>
                </div>
                
                {loading ? (
                  <div className="grid grid-responsive grid-responsive-2 grid-responsive-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="skeleton h-80 rounded-xl"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-responsive grid-responsive-2 grid-responsive-3 gap-6 stagger-children">
                    {featuredGames.map((game) => (
                      <ModernGameCard 
                        key={game.id} 
                        game={{
                          ...game,
                          category: Array.isArray(game.category) ? game.category[0] : game.category,
                          difficulty: 'Medium',
                          playTime: '5-15 min',
                          players: '1 player'
                        }} 
                        onPlay={() => navigate(`/game/${game.id}`)}
                      />
                    ))}
                  </div>
                )}
                
                <div className="text-center mt-12">
                  <Button 
                    size="lg"
                    className="btn-primary-modern"
                    onClick={() => navigate('/browse')}
                  >
                    Explore All Games
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </section>
            
            {/* Trending Games Section */}
            <section className="section-container">
              <div className="container-responsive">
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4 animate-fadeIn">
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                      <TrendingUp className="h-5 w-5 text-unigames-purple" />
                      <Badge className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-600 border-amber-500/30">
                        Hot This Week
                      </Badge>
                    </div>
                    <h2 className="text-responsive-2xl font-bold mb-2">Trending Now</h2>
                    <p className="text-muted-foreground">Most popular games this week</p>
                  </div>
                  <Button 
                    variant="outline" 
                    className="btn-secondary-modern"
                    onClick={() => navigate('/trending')}
                  >
                    View All Trending
                  </Button>
                </div>
                
                {loading ? (
                  <div className="grid grid-responsive grid-responsive-2 grid-responsive-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                      <div key={index} className="skeleton h-80 rounded-xl"></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-responsive grid-responsive-2 grid-responsive-3 gap-6 stagger-children">
                    {trendingGames.map((game, index) => (
                      <div key={game.id} className="relative">
                        {index < 3 && (
                          <Badge className="absolute -top-2 -right-2 z-20 bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse-custom">
                            #{index + 1}
                          </Badge>
                        )}
                        <ModernGameCard 
                          game={{
                            ...game,
                            category: Array.isArray(game.category) ? game.category[0] : game.category,
                            difficulty: 'Medium',
                            playTime: '5-15 min',
                            players: '1 player'
                          }} 
                          onPlay={() => navigate(`/game/${game.id}`)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
            
            {/* Quick Play Section */}
            <section className="section-container bg-muted/30">
              <div className="container-responsive">
                <div className="text-center mb-12 animate-fadeIn">
                  <h2 className="text-responsive-2xl font-bold mb-4">Quick Play Classics</h2>
                  <p className="text-muted-foreground mb-6">Jump right into these timeless favorites</p>
                  <div className="section-divider"></div>
                </div>
                
                <div className="grid grid-responsive grid-responsive-2 grid-responsive-4 gap-6 stagger-children">
                  {[
                    { name: 'Snake Classic', emoji: '🐍', desc: 'Eat food, grow longer!', id: 'snake' },
                    { name: 'Flappy Bird', emoji: '🐦', desc: 'Navigate through pipes', id: 'flappy-bird' },
                    { name: 'Tic Tac Toe', emoji: '⭕', desc: 'Classic 3x3 strategy', id: 'tic-tac-toe' },
                    { name: 'Memory Match', emoji: '🧠', desc: 'Find matching pairs', id: 'memory-match' }
                  ].map((game) => (
                    <Card key={game.id} className="card-responsive hover-lift cursor-pointer group" onClick={() => {
                      const workingGame = workingGames.find(g => g.id === game.id);
                      if (workingGame) handlePlayGame(workingGame);
                    }}>
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {game.emoji}
                        </div>
                        <h3 className="font-semibold mb-2">{game.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{game.desc}</p>
                        <Button size="sm" className="btn-primary-modern">
                          <Play className="h-3 w-3 mr-1" />
                          Play Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
            
            {/* CTA Section */}
            <section className="section-container bg-gradient-to-r from-unigames-purple/10 via-unigames-blue/10 to-unigames-cyan/10">
              <div className="container-responsive text-center">
                <div className="max-w-3xl mx-auto animate-fadeIn">
                  <h2 className="text-responsive-2xl font-bold mb-6">Ready to Start Your Gaming Journey?</h2>
                  <p className="text-responsive-lg text-muted-foreground mb-8">
                    Join thousands of players enjoying premium browser games with achievements, social features, and more.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="btn-primary-modern text-lg px-12 py-6"
                      onClick={() => navigate('/games')}
                    >
                      Start Playing Free
                    </Button>
                    <Button 
                      variant="outline"
                      size="lg" 
                      className="btn-secondary-modern text-lg px-12 py-6"
                      onClick={() => navigate('/browse')}
                    >
                      Browse All Games
                    </Button>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Enhanced Footer */}
            <footer className="py-16 px-4 md:px-8 bg-card border-t border-border">
              <div className="container-responsive">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Gamepad className="h-8 w-8 text-unigames-purple" />
                      <span className="text-xl font-bold text-gradient font-['Poppins']">
                        UNIGAMES
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      The ultimate browser gaming platform with 30+ premium games, achievements, and social features.
                    </p>
                  </div>
                  
                  {[
                    {
                      title: 'Games',
                      links: [
                        { name: 'Browse All', path: '/browse' },
                        { name: 'Categories', path: '/categories' },
                        { name: 'Trending', path: '/trending' },
                        { name: 'New Releases', path: '/games' }
                      ]
                    },
                    {
                      title: 'Features',
                      links: [
                        { name: 'Achievements', path: '/' },
                        { name: 'Leaderboards', path: '/' },
                        { name: 'Social Gaming', path: '/' },
                        { name: 'Progress Tracking', path: '/' }
                      ]
                    },
                    {
                      title: 'Support',
                      links: [
                        { name: 'Help Center', path: '/' },
                        { name: 'Contact Us', path: '/' },
                        { name: 'Privacy Policy', path: '/' },
                        { name: 'Terms of Service', path: '/' }
                      ]
                    }
                  ].map((section) => (
                    <div key={section.title}>
                      <h3 className="font-semibold mb-4 text-foreground">{section.title}</h3>
                      <ul className="space-y-2">
                        {section.links.map((link) => (
                          <li key={link.name}>
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-muted-foreground hover:text-unigames-purple transition-colors"
                              onClick={() => navigate(link.path)}
                            >
                              {link.name}
                            </Button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                  <p className="text-muted-foreground text-sm">
                    © 2025 UNIGAMES. All rights reserved.
                  </p>
                  <div className="flex items-center gap-6">
                    <Badge variant="outline" className="border-green-500/30 text-green-600">
                      100% Working Games
                    </Badge>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-600">
                      No Downloads Required
                    </Badge>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </SidebarInset>
        <AppSidebar />
      </div>

      {/* Game Modal */}
      <Dialog open={isGameModalOpen} onOpenChange={setIsGameModalOpen}>
        <DialogContent className="max-w-[95vw] md:max-w-6xl h-[90vh] p-0 overflow-hidden glass-effect">
          <DialogHeader className="p-4 md:p-6 pb-0 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
                {selectedGame?.title}
                <Badge className="bg-green-500 hover:bg-green-500 animate-pulse-custom">
                  <div className="w-2 h-2 bg-white rounded-full mr-1"></div>
                  LIVE
                </Badge>
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={closeGameModal} className="hover:bg-destructive/10 hover:text-destructive">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            {renderGameComponent()}
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default Index;
