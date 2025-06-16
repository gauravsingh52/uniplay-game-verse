
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Star, Clock, Users } from "lucide-react";

interface ModernGameCardProps {
  game: {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    category: string;
    difficulty: string;
    playTime: string;
    rating?: number;
    players?: string;
  };
  onPlay: (game: any) => void;
  className?: string;
}

const ModernGameCard = ({ game, onPlay, className = "" }: ModernGameCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(game);
  };

  return (
    <Card className={`group card-responsive hover-lift overflow-hidden ${className} animate-scaleIn`}>
      {/* Game Thumbnail */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-unigames-purple/20 to-unigames-blue/20">
        {!imageError ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            className={`img-responsive group-hover:scale-110 transition-transform duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
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
          <div className="absolute inset-0 loading-shimmer" />
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="lg"
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-white/30 ripple-effect transform scale-90 group-hover:scale-100 transition-transform duration-300"
            onClick={handlePlayClick}
          >
            <Play className="h-5 w-5 mr-2" />
            Play Now
          </Button>
        </div>

        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <Badge className="bg-green-500/90 hover:bg-green-500 backdrop-blur-sm">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse-custom"></div>
            LIVE
          </Badge>
        </div>

        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/80 backdrop-blur-sm border-border/50">
            {game.difficulty}
          </Badge>
        </div>
      </div>
      
      {/* Game Info */}
      <CardContent className="p-4 md:p-6">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-base md:text-lg line-clamp-1 group-hover:text-unigames-purple transition-colors duration-300">
              {game.title}
            </h3>
            {game.rating && (
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">{game.rating}</span>
              </div>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {game.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{game.playTime}</span>
              </div>
              {game.players && (
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{game.players}</span>
                </div>
              )}
            </div>
            <Badge variant="secondary" className="text-xs capitalize bg-unigames-purple/10 text-unigames-purple">
              {game.category}
            </Badge>
          </div>
          
          <Button 
            className="w-full bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white font-medium ripple-effect smooth-transition"
            onClick={handlePlayClick}
          >
            <Play className="h-4 w-4 mr-2" />
            Play Game
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModernGameCard;
