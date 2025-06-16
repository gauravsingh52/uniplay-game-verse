
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Gamepad2, Sun, Moon } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/hooks/useTheme';

const ResponsiveNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Games', path: '/games' },
    { name: 'Browse', path: '/browse' },
    { name: 'Categories', path: '/categories' },
    { name: 'Trending', path: '/trending' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-background/80 backdrop-blur-lg border-b border-border shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group animate-slideInLeft"
            onClick={() => handleNavigation('/')}
          >
            <div className="relative">
              <Gamepad2 className="h-8 w-8 md:h-10 md:w-10 text-unigames-purple group-hover:text-unigames-blue transition-colors duration-300" />
              <div className="absolute -inset-1 bg-unigames-purple/20 rounded-full blur-sm group-hover:bg-unigames-blue/20 transition-colors duration-300 -z-10"></div>
            </div>
            <span className="text-xl md:text-2xl font-bold font-['Poppins'] bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
              UNIGAMES
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigationItems.map((item, index) => (
              <Button
                key={item.name}
                variant="ghost"
                className="text-base font-medium hover:text-unigames-purple transition-colors duration-300 hover:bg-unigames-purple/10 animate-fadeIn"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleNavigation(item.path)}
              >
                {item.name}
              </Button>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full hover:bg-unigames-purple/10 transition-all duration-300 animate-slideInRight"
            >
              {theme === 'dark' ? 
                <Sun className="h-5 w-5 text-yellow-500" /> : 
                <Moon className="h-5 w-5 text-unigames-purple" />
              }
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden w-10 h-10 rounded-full hover:bg-unigames-purple/10 transition-all duration-300 animate-slideInRight"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 glass-effect">
                <div className="flex flex-col space-y-6 mt-8">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Menu</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-8 h-8"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    {navigationItems.map((item, index) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="justify-start text-base font-medium h-12 hover:bg-unigames-purple/10 hover:text-unigames-purple transition-all duration-300 animate-slideInRight"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        onClick={() => handleNavigation(item.path)}
                      >
                        {item.name}
                      </Button>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-border">
                    <Button
                      className="w-full bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white font-semibold h-12 rounded-xl ripple-effect"
                      onClick={() => handleNavigation('/games')}
                    >
                      Start Playing
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ResponsiveNavbar;
