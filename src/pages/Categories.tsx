
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { workingGames } from '@/data/workingGamesData';
import { useNavigate } from 'react-router-dom';
import { Gamepad2, Users, Star, Play, TrendingUp, Grid } from 'lucide-react';

const Categories = () => {
  const navigate = useNavigate();

  // Group games by category
  const categorizedGames = workingGames.reduce((acc, game) => {
    if (!acc[game.category]) {
      acc[game.category] = [];
    }
    acc[game.category].push(game);
    return acc;
  }, {} as Record<string, typeof workingGames>);

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      'Puzzle': Grid,
      'Action': TrendingUp,
      'Arcade': Gamepad2,
      'Strategy': Star,
      'Adventure': Play,
      'Casual': Users
    };
    return icons[category] || Gamepad2;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Puzzle': 'from-purple-500 to-pink-500',
      'Action': 'from-red-500 to-orange-500',
      'Arcade': 'from-blue-500 to-cyan-500',
      'Strategy': 'from-green-500 to-emerald-500',
      'Adventure': 'from-yellow-500 to-amber-500',
      'Casual': 'from-indigo-500 to-purple-500'
    };
    return colors[category] || 'from-gray-500 to-slate-500';
  };

  return (
    <div className="pt-20 pb-16 px-4 md:px-8 min-h-screen">
      <div className="container mx-auto max-w-7xl">
        {/* Header with animations */}
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
            Game Categories
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Explore our collection of {workingGames.length} games across different categories
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-unigames-purple to-unigames-blue mx-auto rounded-full"></div>
        </div>

        {/* Categories Grid with responsive design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 stagger-children">
          {Object.entries(categorizedGames).map(([category, games]) => {
            const IconComponent = getCategoryIcon(category);
            const colorGradient = getCategoryColor(category);
            
            return (
              <Card 
                key={category} 
                className="hover-lift cursor-pointer group bg-card/80 backdrop-blur-sm border-border/50 card-responsive"
                onClick={() => navigate(`/category/${category.toLowerCase()}`)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 md:w-16 h-12 md:h-16 rounded-2xl bg-gradient-to-br ${colorGradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl md:text-2xl font-bold text-foreground group-hover:text-unigames-purple transition-colors">
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-unigames-purple/10 text-unigames-purple border-unigames-purple/20">
                      {games.length} Games
                    </Badge>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>4.5+</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Popular games in this category:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {games.slice(0, 3).map((game) => (
                        <Badge key={game.id} variant="outline" className="text-xs">
                          {game.title}
                        </Badge>
                      ))}
                      {games.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{games.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/category/${category.toLowerCase()}`);
                    }}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Explore {category}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-unigames-purple/10 to-unigames-blue/10 rounded-2xl p-6 md:p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Why Choose Our Game Categories?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-unigames-purple/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gamepad2 className="h-6 w-6 text-unigames-purple" />
                </div>
                <h3 className="font-semibold mb-2">Instant Play</h3>
                <p className="text-sm text-muted-foreground">No downloads required. Start playing immediately in your browser.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-unigames-blue/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="h-6 w-6 text-unigames-blue" />
                </div>
                <h3 className="font-semibold mb-2">Social Gaming</h3>
                <p className="text-sm text-muted-foreground">Compete with friends and climb the leaderboards.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-unigames-cyan/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-unigames-cyan" />
                </div>
                <h3 className="font-semibold mb-2">High Quality</h3>
                <p className="text-sm text-muted-foreground">Curated collection of premium browser games.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
