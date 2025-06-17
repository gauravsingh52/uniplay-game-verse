
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Star, Clock, Users, Heart, Share, Trophy } from "lucide-react";
import { EnhancedGame } from '@/data/enhancedGamesData';
import { cn } from '@/lib/utils';

interface EnhancedGameCardProps {
  game: EnhancedGame;
  onPlay?: (game: EnhancedGame) => void;
  className?: string;
  variant?: 'default' | 'featured' | 'compact';
}

const EnhancedGameCard = ({ game, onPlay, className = "", variant = 'default' }: EnhancedGameCardProps) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay(game);
    } else {
      navigate(`/game/${game.id}`);
    }
  };

  const handleCardClick = () => {
    navigate(`/game/${game.id}`);
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const shareGame = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Play ${game.title}`,
        text: game.description,
        url: window.location.href
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-600 border-green-500/30';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'Hard': return 'bg-red-500/20 text-red-600 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  if (variant === 'featured') {
    return (
      <Card 
        className={cn(
          "group relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] bg-gradient-to-br from-card to-card/90 border-2 hover:border-unigames-purple/50",
          className
        )}
        onClick={handleCardClick}
      >
        {/* Featured Banner */}
        <div className="absolute top-3 left-3 z-20">
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse-custom">
            <Trophy className="w-3 h-3 mr-1" />
            FEATURED
          </Badge>
        </div>

        {/* Enhanced Thumbnail */}
        <div className="relative aspect-[16/9] overflow-hidden">
          {!imageError ? (
            <img
              src={game.thumbnail}
              alt={game.title}
              className={cn(
                "w-full h-full object-cover group-hover:scale-110 transition-transform duration-700",
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-unigames-purple/30 to-unigames-blue/30">
              <Play className="h-16 w-16 text-white/70" />
            </div>
          )}

          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
              onClick={toggleFavorite}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500 text-red-500")} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
              onClick={shareGame}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-90">
            <Button
              size="lg"
              className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white shadow-2xl"
              onClick={handlePlayClick}
            >
              <Play className="h-6 w-6 mr-2" />
              Play Now
            </Button>
          </div>
        </div>
        
        {/* Game Info */}
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl font-bold group-hover:text-unigames-purple transition-colors duration-300">
                {game.title}
              </CardTitle>
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{game.rating}</span>
              </div>
            </div>
            
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
              {game.description}
            </p>
            
            <div className="flex flex-wrap gap-2">
              {game.category.slice(0, 3).map((cat, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-unigames-purple/10 text-unigames-purple">
                  {cat}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{game.playTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{game.players}</span>
                </div>
              </div>
              <Badge variant="outline" className={getDifficultyColor(game.difficulty)}>
                {game.difficulty}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        "group h-full flex flex-col cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-gradient-to-b from-card to-card/90 border hover:border-unigames-purple/30",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-unigames-purple/20 to-unigames-blue/20">
        {!imageError ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            className={cn(
              "w-full h-full object-cover group-hover:scale-110 transition-transform duration-500",
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-unigames-purple/30 to-unigames-blue/30">
            <Play className="h-12 w-12 text-white/70" />
          </div>
        )}
        
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
        )}

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {game.featured && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
              FEATURED
            </Badge>
          )}
          {game.rating >= 4.5 && (
            <Badge className="bg-green-500/90 text-white text-xs">
              <Star className="w-3 h-3 mr-1 fill-current" />
              TOP
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
            onClick={toggleFavorite}
          >
            <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500 text-red-500")} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white"
            onClick={shareGame}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="lg"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 transform scale-90 group-hover:scale-100 transition-transform duration-300"
            onClick={handlePlayClick}
          >
            <Play className="h-5 w-5 mr-2" />
            Play Now
          </Button>
        </div>
      </div>
      
      {/* Game Info */}
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className="space-y-3 flex-grow">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-base line-clamp-1 group-hover:text-unigames-purple transition-colors duration-300">
              {game.title}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="text-sm font-medium">{game.rating}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {game.description}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {game.category.slice(0, 2).map((cat, index) => (
              <Badge key={index} variant="secondary" className="text-xs capitalize bg-unigames-purple/10 text-unigames-purple">
                {cat}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mt-auto">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{game.playTime}</span>
            </div>
            <Badge variant="outline" className={getDifficultyColor(game.difficulty) + " text-xs"}>
              {game.difficulty}
            </Badge>
          </div>
        </div>
        
        <Button 
          className="w-full mt-4 bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white font-medium transition-all duration-300"
          onClick={handlePlayClick}
        >
          <Play className="h-4 w-4 mr-2" />
          Play Game
        </Button>
      </CardContent>
    </Card>
  );
};

export default EnhancedGameCard;
