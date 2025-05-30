
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, Clock, Gamepad, Bookmark, 
  Heart, Bell, Settings, Play
} from "lucide-react";
import Navbar from '@/components/Navbar';
import { gamesData } from '@/data/gamesData';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';

const Dashboard = () => {
  // In a real app, these would be fetched from an API
  const recentlyPlayed = gamesData.slice(0, 4);
  const favorites = gamesData.slice(5, 9);
  const [activeTab, setActiveTab] = useState('recent');
  const { user, signOut } = useAuth(); // Get the authenticated user
  const navigate = useNavigate();
  
  // Get the user's name from metadata or email if not available
  const userName = user?.user_metadata?.full_name || 
                   user?.user_metadata?.name ||
                   (user?.email ? user.email.split('@')[0] : 'User');

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <SidebarInset className="flex-1">
          <div className="flex flex-col min-h-screen">
            <div className="flex items-center justify-between px-4 py-2 border-b border-border">
              <div />
              <SidebarTrigger className="-mr-1" />
            </div>
            
            <Navbar />
            
            <div className="pt-24 pb-16 px-4 md:px-8 flex-1">
              <div className="container mx-auto">
                <h1 className="text-3xl font-bold mb-8">Welcome, {userName}</h1>
                
                <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-8">
                    <TabsTrigger value="recent">Recently Played</TabsTrigger>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="recent">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {recentlyPlayed.map((game) => (
                        <div key={game.id} className="bg-card rounded-lg overflow-hidden border border-border group">
                          <div className="relative">
                            <img 
                              src={game.thumbnail} 
                              alt={game.title} 
                              className="w-full aspect-video object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Link to={`/game/${game.id}`}>
                                <Button className="bg-unigames-purple hover:bg-unigames-purple/80">
                                  <Play className="mr-2 h-4 w-4" /> Play
                                </Button>
                              </Link>
                            </div>
                            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                              {new Date().toLocaleDateString()} • 2h 15m
                            </div>
                          </div>
                          <div className="p-4">
                            <Link to={`/game/${game.id}`} className="font-medium hover:text-unigames-purple transition-colors">
                              {game.title}
                            </Link>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-sm text-muted-foreground">
                                {game.category[0]}
                              </div>
                              <div className="text-xs bg-muted px-2 py-1 rounded">
                                {game.releaseYear}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {recentlyPlayed.length === 0 && (
                      <div className="text-center py-12">
                        <Gamepad className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No recently played games</h3>
                        <p className="text-muted-foreground mb-4">
                          Start playing games to see them here
                        </p>
                        <Link to="/">
                          <Button className="bg-unigames-purple hover:bg-unigames-purple/80">
                            Browse Games
                          </Button>
                        </Link>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="favorites">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {favorites.map((game) => (
                        <div key={game.id} className="bg-card rounded-lg overflow-hidden border border-border group">
                          <div className="relative">
                            <img 
                              src={game.thumbnail} 
                              alt={game.title} 
                              className="w-full aspect-video object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Link to={`/game/${game.id}`}>
                                <Button className="bg-unigames-purple hover:bg-unigames-purple/80">
                                  <Play className="mr-2 h-4 w-4" /> Play
                                </Button>
                              </Link>
                            </div>
                            <div className="absolute top-2 right-2 text-red-500">
                              <Heart className="h-5 w-5 fill-current" />
                            </div>
                          </div>
                          <div className="p-4">
                            <Link to={`/game/${game.id}`} className="font-medium hover:text-unigames-purple transition-colors">
                              {game.title}
                            </Link>
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-sm text-muted-foreground">
                                {game.category[0]}
                              </div>
                              <div className="text-xs bg-muted px-2 py-1 rounded">
                                {game.releaseYear}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {favorites.length === 0 && (
                      <div className="text-center py-12">
                        <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="font-medium mb-2">No favorite games yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Add games to your favorites to see them here
                        </p>
                        <Link to="/">
                          <Button className="bg-unigames-purple hover:bg-unigames-purple/80">
                            Browse Games
                          </Button>
                        </Link>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                
                {/* Subscription section */}
                <div className="mt-12 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Upgrade Your Experience</h2>
                      <p className="text-gray-300 mb-4">
                        Enjoy premium games, 4K streaming, and no waiting queues with our Pro plan.
                      </p>
                      <ul className="space-y-2 mb-6">
                        <li className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-unigames-purple/20 flex items-center justify-center mr-2">
                            <div className="h-2 w-2 rounded-full bg-unigames-purple"></div>
                          </div>
                          <span>Access to 100+ premium games</span>
                        </li>
                        <li className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-unigames-purple/20 flex items-center justify-center mr-2">
                            <div className="h-2 w-2 rounded-full bg-unigames-purple"></div>
                          </div>
                          <span>4K streaming on supported devices</span>
                        </li>
                        <li className="flex items-center">
                          <div className="h-5 w-5 rounded-full bg-unigames-purple/20 flex items-center justify-center mr-2">
                            <div className="h-2 w-2 rounded-full bg-unigames-purple"></div>
                          </div>
                          <span>No waiting queues</span>
                        </li>
                      </ul>
                      <Button className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow">
                        Upgrade to Pro
                      </Button>
                    </div>
                    <div className="hidden md:block">
                      <img 
                        src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
                        alt="Premium gaming"
                        className="rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
        <AppSidebar />
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
