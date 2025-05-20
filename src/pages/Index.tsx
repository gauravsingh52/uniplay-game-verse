
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GameCarousel from '@/components/GameCarousel';
import GameCard from '@/components/GameCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from "@/components/ui/button";
import { getFeaturedGames, getGamesByCategory, getAllCategories, gamesData } from '@/data/gamesData';
import { ArrowRight, Gamepad, Star, Play, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredGames, setFilteredGames] = useState(gamesData);
  const featuredGames = getFeaturedGames();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero section */}
      <section className="pt-24 pb-8 px-4 md:px-8 hero-gradient">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
                Play Instantly.<br />
                No Downloads.
              </h1>
              <p className="text-lg text-gray-300 mb-8">
                Access premium games directly in your browser. No installations, no waiting. Just click and play.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow"
                  onClick={handleBrowseAll}
                >
                  <Play className="mr-2 h-4 w-4" /> Start Playing
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-unigames-purple text-unigames-purple hover:bg-unigames-purple/10"
                  onClick={() => navigate('/categories')}
                >
                  <Gamepad className="mr-2 h-4 w-4" /> Browse Categories
                </Button>
              </div>
            </div>
            <div className="hidden lg:flex relative justify-center">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-unigames-purple/20 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-unigames-blue/20 rounded-full filter blur-3xl"></div>
              
              {/* Game cards floating animation */}
              <div className="relative">
                {/* Main game card */}
                <div className="relative z-30 animate-float bg-card rounded-xl overflow-hidden shadow-xl border border-border">
                  <img
                    src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                    alt="Gaming"
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold">Start Playing Now</h3>
                    <p className="text-sm text-muted-foreground">Hundreds of games available</p>
                  </div>
                </div>
                
                {/* Background floating cards */}
                <div className="absolute top-20 -left-20 z-10 rotate-[-10deg] animate-float delay-300 hidden md:block">
                  <div className="bg-card w-40 h-40 rounded-lg overflow-hidden shadow-lg border border-border">
                    <img
                      src="https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Game"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="absolute bottom-10 -right-10 z-10 rotate-[10deg] animate-float delay-500 hidden md:block">
                  <div className="bg-card w-32 h-32 rounded-lg overflow-hidden shadow-lg border border-border">
                    <img
                      src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
                      alt="Game"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-2/3 lg:w-1/2 mx-auto mt-6 mb-12">
            <SearchBar fullWidth={true} />
          </div>
        </div>
      </section>
      
      {/* Featured Games */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <GameCarousel games={featuredGames} title="Featured Games" />
        </div>
      </section>
      
      {/* Trending Now */}
      <section className="py-12 px-4 md:px-8 bg-muted/30">
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
      <section className="py-12 px-4 md:px-8">
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
      <section className="py-12 px-4 md:px-8 bg-muted/30">
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
  );
};

export default Index;
