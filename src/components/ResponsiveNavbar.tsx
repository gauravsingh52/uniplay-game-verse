
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Gamepad, Menu, User, Settings, LogOut, LogIn, UserPlus, Star, TrendingUp, Grid3X3, Search, Zap } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

const ResponsiveNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut, isAuthenticated, isLoading } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const navItems = [
    { label: 'Home', path: '/', icon: Gamepad },
    { label: 'All Games', path: '/games', icon: Grid3X3 },
    { label: 'Categories', path: '/categories', icon: Grid3X3 },
    { label: 'Trending', path: '/trending', icon: TrendingUp },
    { label: 'Browse', path: '/browse', icon: Search },
    { label: 'Features', path: '/features', icon: Star },
    { label: 'Support', path: '/support', icon: Zap },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const UserAvatar = () => (
    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-unigames-purple to-unigames-blue flex items-center justify-center text-white font-medium text-sm">
      {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => handleNavigation('/')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-unigames-purple to-unigames-blue flex items-center justify-center">
              <Gamepad className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
              UNIGAMES
            </span>
            <Badge variant="secondary" className="hidden sm:inline-flex text-xs bg-unigames-purple/10 text-unigames-purple">
              13 Games
            </Badge>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={isActivePath(item.path) ? "default" : "ghost"}
                size="sm"
                className={`${
                  isActivePath(item.path) 
                    ? "bg-unigames-purple text-white hover:bg-unigames-purple/80" 
                    : "hover:bg-unigames-purple/10 hover:text-unigames-purple"
                } transition-all duration-200`}
                onClick={() => handleNavigation(item.path)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isLoading && (
              <>
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-10 w-10 rounded-full p-0 hover:bg-unigames-purple/10">
                        <UserAvatar />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <UserAvatar />
                        <div className="flex flex-col space-y-1 leading-none">
                          <p className="font-medium text-sm">
                            {user?.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleNavigation('/dashboard')}>
                        <User className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleNavigation('/settings')}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleNavigation('/login')}
                      className="hover:bg-unigames-purple/10 hover:text-unigames-purple"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleNavigation('/signup')}
                      className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-unigames-purple/10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2 text-left">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-unigames-purple to-unigames-blue flex items-center justify-center">
                      <Gamepad className="h-5 w-5 text-white" />
                    </div>
                    UNIGAMES
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-1">
                  {/* User info for mobile */}
                  {!isLoading && isAuthenticated && (
                    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
                      <UserAvatar />
                      <div>
                        <p className="font-medium text-sm">
                          {user?.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Navigation items */}
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant={isActivePath(item.path) ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        isActivePath(item.path) 
                          ? "bg-unigames-purple text-white" 
                          : "hover:bg-unigames-purple/10 hover:text-unigames-purple"
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  ))}

                  {/* Auth buttons for mobile */}
                  {!isLoading && (
                    <div className="pt-4 space-y-2">
                      {isAuthenticated ? (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start hover:bg-unigames-purple/10"
                            onClick={() => handleNavigation('/dashboard')}
                          >
                            <User className="h-4 w-4 mr-3" />
                            Dashboard
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start hover:bg-unigames-purple/10"
                            onClick={() => handleNavigation('/settings')}
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            Settings
                          </Button>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={handleSignOut}
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Sign out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            className="w-full justify-start hover:bg-unigames-purple/10"
                            onClick={() => handleNavigation('/login')}
                          >
                            <LogIn className="h-4 w-4 mr-3" />
                            Login
                          </Button>
                          <Button
                            className="w-full justify-start bg-gradient-to-r from-unigames-purple to-unigames-blue text-white"
                            onClick={() => handleNavigation('/signup')}
                          >
                            <UserPlus className="h-4 w-4 mr-3" />
                            Sign Up
                          </Button>
                        </>
                      )}
                    </div>
                  )}
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
