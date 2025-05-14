
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, User, Gamepad } from "lucide-react";
import SearchBar from './SearchBar';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <nav className="py-4 px-4 md:px-8 border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Gamepad className="h-8 w-8 text-unigames-purple" />
          <span className="text-2xl font-bold text-white font-mono">
            UNI<span className="text-unigames-purple">GAMES</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/browse" className="text-gray-300 hover:text-white transition-colors">
            Browse
          </Link>
          <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
            Library
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {isSearchOpen ? (
            <div className="w-64">
              <SearchBar onClose={toggleSearch} />
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              className="text-gray-300 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            variant="ghost" 
            className="text-gray-300 hover:text-white ml-2"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          
          <Button 
            variant="default" 
            className="bg-unigames-purple hover:bg-unigames-purple/80 ml-2 button-glow"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
