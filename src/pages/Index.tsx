import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GameCarousel from '@/components/GameCarousel';
import GameCard from '@/components/GameCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from "@/components/ui/button";
import { getFeaturedGames, getGamesByCategory, getAllCategories, gamesData } from '@/data/gamesData';
import { ArrowRight, Gamepad, Star, Play, TrendingUp, Zap, Users, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredGames, setFilteredGames] = useState(gamesData);
  const featuredGames = getFeaturedGames();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Get trending games (for this demo, sort by highest rating)
  const trendingGames = [...gamesData]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);

  // Get newest games
  const newestGames = [...gamesData]
    .sort((a, b) => b.releaseYear - a.releaseYear)
    .slice(0, 5);

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredGames(gamesData.slice(0, 10));
    } else {
      setFilteredGames(getGamesByCategory(selectedCategory).slice(0, 10));
    }
  }, [selectedCategory]);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleBrowseAll = () => {
    navigate('/browse');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SidebarInset className="flex-1">
          <div className="flex flex-col min-h-screen">
            {isAuthenticated && (
              <div className="flex items-center justify-end gap-2 px-4 py-2 border-b border-border">
                <SidebarTrigger className="-mr-1" />
              </div>
            )}
            
            <Navbar />
            
            {/* Enhanced Hero section */}
            <section className="relative pt-24 pb-16 px-4 md:px-8 overflow-hidden">
              {/* Animated background gradients */}
              <div className="absolute inset-0 bg-gradient-to-br from-unigames-purple/10 via-background to-unigames-blue/10"></div>
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-unigames-purple/5 rounded-full filter blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-unigames-blue/5 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
              
              <div className="container mx-auto relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-16">
                  {/* Left content */}
                  <div className="space-y-8 animate-fade-in">
                    {/* Hero badge */}
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 backdrop-blur-sm border border-unigames-purple/30 rounded-full px-4 py-2 text-sm font-medium">
                      <Zap className="w-4 h-4 text-unigames-purple animate-pulse" />
                      <span>Instant Gaming Experience</span>
                    </div>
                    
                    {/* Main heading with enhanced typography */}
                    <div className="space-y-4">
                      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                        <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                          Play Instantly.
                        </span>
                        <br />
                        <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                          No Downloads.
                        </span>
                      </h1>
                      <p className="text-xl text-gray-300 leading-relaxed max-w-xl">
                        Access premium games directly in your browser. No installations, no waiting. 
                        Just click and play with our cutting-edge cloud gaming technology.
                      </p>
                    </div>
                    
                    {/* Feature highlights */}
                    <div className="flex flex-wrap gap-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-unigames-purple" />
                        <span>Instant Access</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-unigames-blue" />
                        <span>1M+ Players</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-unigames-cyan" />
                        <span>100% Secure</span>
                      </div>
                    </div>
                    
                    {/* Enhanced action buttons */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        size="lg" 
                        className="group bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        onClick={() => navigate('/games')}
                      >
                        <Play className="mr-2 h-5 w-5 group-hover:animate-pulse" /> 
                        Play Classic Games
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="group border-2 border-unigames-purple/50 bg-background/50 backdrop-blur-sm text-unigames-purple hover:bg-unigames-purple/10 hover:border-unigames-purple font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                        onClick={handleBrowseAll}
                      >
                        <Gamepad className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" /> 
                        Browse Cloud Games
                      </Button>
                    </div>
                    
                    {/* Additional CTA */}
                    <div className="pt-4">
                      <Button 
                        variant="ghost"
                        className="text-gray-400 hover:text-unigames-purple transition-colors duration-300"
                        onClick={() => navigate('/categories')}
                      >
                        Explore Game Categories
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Right content - Enhanced floating cards */}
                  <div className="hidden lg:flex relative justify-center items-center">
                    {/* Main showcase card */}
                    <div className="relative z-30 group">
                      <div className="absolute -inset-4 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                      <div className="relative bg-card/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-border/50 transform group-hover:scale-105 transition-all duration-500 animate-float">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-unigames-purple to-unigames-blue"></div>
                        <img
                          src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                          alt="Gaming showcase"
                          className="w-full h-64 object-cover"
                        />
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl">Premium Gaming</h3>
                            <Badge className="bg-unigames-purple/20 text-unigames-purple border-unigames-purple/30">
                              HD Quality
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Experience console-quality games with zero latency
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium">4.9/5</span>
                            </div>
                            <span className="text-xs text-muted-foreground">1000+ Games</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Floating accent cards */}
                    <div className="absolute top-16 -left-20 z-10 rotate-[-15deg] animate-float delay-300 hidden xl:block">
                      <div className="bg-card/70 backdrop-blur-sm w-48 h-32 rounded-xl overflow-hidden shadow-lg border border-border/30 hover:scale-110 transition-transform duration-300">
                        <div className="h-full bg-gradient-to-br from-unigames-purple/20 to-unigames-blue/20 flex items-center justify-center">
                          <div className="text-center">
                            <Gamepad className="h-8 w-8 mx-auto mb-2 text-unigames-purple" />
                            <p className="text-sm font-medium">Instant Play</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute bottom-12 -right-16 z-10 rotate-[12deg] animate-float delay-500 hidden xl:block">
                      <div className="bg-card/70 backdrop-blur-sm w-40 h-28 rounded-xl overflow-hidden shadow-lg border border-border/30 hover:scale-110 transition-transform duration-300">
                        <div className="h-full bg-gradient-to-br from-unigames-cyan/20 to-unigames-pink/20 flex items-center justify-center">
                          <div className="text-center">
                            <Users className="h-6 w-6 mx-auto mb-1 text-unigames-cyan" />
                            <p className="text-xs font-medium">1M+ Players</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced search section */}
                <div className="w-full max-w-2xl mx-auto mt-12 mb-8 animate-fade-in delay-300">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                    <div className="relative">
                      <SearchBar fullWidth={true} />
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-400 mt-4">
                    Search from over 1000+ premium games
                  </p>
                </div>
                
                {/* Trust indicators */}
                <div className="flex items-center justify-center space-x-8 mt-16 opacity-60">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-unigames-purple">1M+</div>
                    <div className="text-xs text-gray-400">Active Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-unigames-blue">1000+</div>
                    <div className="text-xs text-gray-400">Games Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-unigames-cyan">24/7</div>
                    <div className="text-xs text-gray-400">Support</div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Featured Games */}
            <section className="py-12 px-4 md:px-8">
              <div className="container mx-auto">
                <GameCarousel games={featuredGames} title="Featured Games" />
              </div>
            </section>
            
            {/* Classic Games Section */}
            <section className="py-12 px-4 md:px-8 bg-muted/30">
              <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Classic Arcade Games</h2>
                    <p className="text-muted-foreground">Play timeless games right in your browser</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-unigames-purple hover:text-unigames-purple/80"
                    onClick={() => navigate('/games')}
                  >
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: 'Snake Classic', emoji: '🐍', desc: 'Eat food, grow longer!' },
                    { name: 'Flappy Bird', emoji: '🐦', desc: 'Navigate through pipes' },
                    { name: 'Tic Tac Toe', emoji: '⭕', desc: 'Classic 3x3 strategy' },
                    { name: 'Memory Match', emoji: '🧠', desc: 'Find matching pairs' }
                  ].map((game, index) => (
                    <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/games')}>
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                          {game.emoji}
                        </div>
                        <h3 className="font-semibold mb-2">{game.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{game.desc}</p>
                        <Button size="sm" className="bg-unigames-purple hover:bg-unigames-purple/80">
                          <Play className="h-3 w-3 mr-1" />
                          Play Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Trending Now */}
            <section className="py-12 px-4 md:px-8">
              <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Trending Now</h2>
                    <p className="text-muted-foreground">What players are enjoying this week</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-unigames-purple hover:text-unigames-purple/80"
                    onClick={() => navigate('/trending')}
                  >
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="bg-muted rounded-lg animate-pulse" style={{height: '260px'}}></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {trendingGames.map((game, index) => (
                      <div key={game.id} className="relative">
                        {index < 3 && (
                          <Badge className="absolute top-2 right-2 z-20 bg-amber-600">
                            <TrendingUp className="h-3 w-3 mr-1" /> Hot
                          </Badge>
                        )}
                        <GameCard game={game} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
            
            {/* Newest Games */}
            <section className="py-12 px-4 md:px-8 bg-muted/30">
              <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Newest Arrivals</h2>
                    <p className="text-muted-foreground">Fresh games just added to our collection</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    className="text-unigames-purple hover:text-unigames-purple/80"
                    onClick={() => navigate('/browse')}
                  >
                    View All <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="bg-muted rounded-lg animate-pulse" style={{height: '260px'}}></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {newestGames.map((game, index) => (
                      <div key={game.id} className="relative">
                        {index < 3 && (
                          <Badge className="absolute top-2 left-2 z-20 bg-unigames-purple">
                            NEW
                          </Badge>
                        )}
                        <GameCard game={game} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
            
            {/* Game Categories */}
            <section className="py-12 px-4 md:px-8">
              <div className="container mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Browse by Category</h2>
                  <Button 
                    variant="ghost" 
                    className="text-unigames-purple hover:text-unigames-purple/80"
                    onClick={() => navigate('/categories')}
                  >
                    All Categories <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <CategoryFilter 
                  selectedCategory={selectedCategory} 
                  onSelectCategory={handleCategorySelect} 
                />
                
                {loading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, index) => (
                      <div key={index} className="bg-muted rounded-lg animate-pulse" style={{height: '260px'}}></div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredGames.map((game) => (
                      <GameCard key={game.id} game={game} />
                    ))}
                  </div>
                )}
                
                {filteredGames.length > 0 && (
                  <div className="flex justify-center mt-8">
                    <Button 
                      onClick={() => selectedCategory === 'All' 
                        ? navigate('/browse') 
                        : navigate(`/category/${selectedCategory}`)
                      }
                      className="bg-unigames-purple hover:bg-unigames-purple/80"
                    >
                      View All {selectedCategory} Games <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </section>
            
            {/* Call to Action */}
            <section className="py-16 px-4 md:px-8 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20">
              <div className="container mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">Ready to Start Gaming?</h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Sign up now to access our full library of games, save your progress, and join a community of cloud gamers.
                </p>
                <Button 
                  size="lg" 
                  className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                </Button>
              </div>
            </section>
            
            {/* Footer */}
            <footer className="py-12 px-4 md:px-8 bg-card border-t border-border">
              <div className="container mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="mb-6 md:mb-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-foreground font-mono">
                        UNI<span className="text-unigames-purple">GAMES</span>
                      </span>
                    </div>
                    <p className="text-gray-400 mt-2">
                      Cloud gaming made simple
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
                    <div>
                      <h3 className="font-semibold mb-2">Platform</h3>
                      <ul className="space-y-1">
                        <li><Button variant="link" onClick={() => navigate('/browse')} className="text-gray-400 hover:text-white p-0 h-auto">Browse Games</Button></li>
                        <li><Button variant="link" onClick={() => navigate('/games')} className="text-gray-400 hover:text-white p-0 h-auto">Classic Games</Button></li>
                        <li><Button variant="link" onClick={() => navigate('/categories')} className="text-gray-400 hover:text-white p-0 h-auto">Categories</Button></li>
                        <li><Button variant="link" onClick={() => navigate('/trending')} className="text-gray-400 hover:text-white p-0 h-auto">Trending</Button></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Company</h3>
                      <ul className="space-y-1">
                        <li><Button variant="link" onClick={() => navigate('/')} className="text-gray-400 hover:text-white p-0 h-auto">About</Button></li>
                        <li><Button variant="link" onClick={() => navigate('/')} className="text-gray-400 hover:text-white p-0 h-auto">Blog</Button></li>
                        <li><Button variant="link" onClick={() => navigate('/')} className="text-gray-400 hover:text-white p-0 h-auto">Careers</Button></li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Support</h3>
                      <ul className="space-y-1">
                        <li><Button variant="link" onClick={() => navigate('/')} className="text-gray-400 hover:text-white p-0 h-auto">Help Center</Button></li>
                        <li><Button variant="link" onClick={() => navigate('/')} className="text-gray-400 hover:text-white p-0 h-auto">Contact</Button></li>
                        <li><Button variant="link" onClick={() => navigate('/')} className="text-gray-400 hover:text-white p-0 h-auto">Terms of Service</Button></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="border-t border-border mt-8 pt-8 text-center text-gray-500">
                  <p>© 2025 UNIGAMES. All rights reserved.</p>
                </div>
              </div>
            </footer>
          </div>
        </SidebarInset>
        <AppSidebar />
      </div>
    </SidebarProvider>
  );
};

export default Index;
