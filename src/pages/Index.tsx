
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import GameCarousel from '@/components/GameCarousel';
import GameCard from '@/components/GameCard';
import CategoryFilter from '@/components/CategoryFilter';
import SearchBar from '@/components/SearchBar';
import { Button } from "@/components/ui/button";
import { getFeaturedGames, getGamesByCategory, getAllCategories, gamesData } from '@/data/gamesData';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredGames, setFilteredGames] = useState(gamesData);
  const featuredGames = getFeaturedGames();
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredGames(gamesData);
    } else {
      setFilteredGames(getGamesByCategory(selectedCategory));
    }
  }, [selectedCategory]);

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
              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow"
                  onClick={handleBrowseAll}
                >
                  Browse Games
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-unigames-purple text-unigames-purple hover:bg-unigames-purple/10"
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-unigames-purple/20 rounded-full filter blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-unigames-blue/20 rounded-full filter blur-3xl"></div>
              <div className="relative animate-float">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                  alt="Gaming setup"
                  className="rounded-lg shadow-2xl object-cover w-full max-w-md mx-auto"
                />
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 mx-auto mt-6 mb-12">
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
      
      {/* Game Categories */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <Button 
              variant="ghost" 
              className="text-unigames-purple hover:text-unigames-purple/80"
              onClick={handleBrowseAll}
            >
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {filteredGames.slice(0, 10).map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
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
                <span className="text-xl font-bold text-white font-mono">
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
                  <li><a href="#" className="text-gray-400 hover:text-white">Browse Games</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Company</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Support</h3>
                <ul className="space-y-1">
                  <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
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
