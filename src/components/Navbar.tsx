
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  Search, 
  User, 
  Gamepad, 
  LogOut, 
  Settings, 
  Moon, 
  Sun,
  Menu,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SearchBar from './SearchBar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/hooks/useTheme";

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isLoading, signOut, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  
  // Get the user's name from metadata or email if not available
  const userName = user?.user_metadata?.full_name || 
                   user?.user_metadata?.name ||
                   (user?.email ? user.email.split('@')[0] : 'Profile');

  const userEmail = user?.email || '';
  
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out.",
        variant: "destructive"
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (path: string) => {
    return location.pathname === path ? "text-foreground font-medium" : "text-muted-foreground";
  };

  const navigationItems = [
    { path: '/', label: 'Home' },
    { path: '/browse', label: 'Browse' },
    { path: '/categories', label: 'Categories' },
    { path: '/trending', label: 'Trending' },
  ];

  // If user is authenticated, add Library to navigation
  if (isAuthenticated) {
    navigationItems.push({ path: '/dashboard', label: 'Library' });
  }

  return (
    <nav className="py-4 px-4 md:px-8 border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 z-20">
          <Gamepad className="h-8 w-8 text-unigames-purple" />
          <span className="text-2xl font-bold text-foreground font-mono">
            UNI<span className="text-unigames-purple">GAMES</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-muted-foreground hover:text-foreground z-20"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navigationItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`${isActive(item.path)} hover:text-foreground transition-colors`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile navigation overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-10 md:hidden flex flex-col items-center justify-center">
            <div className="flex flex-col items-center space-y-6 py-12">
              {navigationItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`${isActive(item.path)} text-lg hover:text-foreground transition-colors`}
                  onClick={toggleMobileMenu}
                >
                  {item.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-foreground w-full"
                    onClick={() => {
                      navigate('/login');
                      toggleMobileMenu();
                    }}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="default" 
                    className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow w-full"
                    onClick={() => {
                      navigate('/signup');
                      toggleMobileMenu();
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {isSearchOpen ? (
            <div className="w-64">
              <SearchBar onClose={toggleSearch} />
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSearch}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {!isLoading && (
            <>
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-muted-foreground hover:text-foreground flex items-center gap-2 pl-2 pr-3">
                      <User className="h-5 w-5" />
                      <span className="max-w-[120px] truncate hidden md:inline-block">{userName}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="font-medium">{userName}</div>
                      <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <Gamepad className="mr-2 h-4 w-4" /> My Library
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="mr-2 h-4 w-4" /> Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                  
                  <Button 
                    variant="default" 
                    className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow"
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
