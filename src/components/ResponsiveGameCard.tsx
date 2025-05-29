
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Star, Heart, Share } from "lucide-react";
import { WorkingGame } from '@/data/workingGamesData';

interface ResponsiveGameCardProps {
  game: WorkingGame;
  onPlay: (game: WorkingGame) => void;
  onFavorite: (gameId: string) => void;
  onShare: (game: WorkingGame) => void;
  isFavorite: boolean;
  gameStats?: {
    plays: number;
    rating: number;
  };
}

export default function ResponsiveGameCard({ 
  game, 
  onPlay, 
  onFavorite, 
  onShare, 
  isFavorite, 
  gameStats 
}: ResponsiveGameCardProps) {
  return (
    <Card 
      className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-2 hover:border-unigames-purple/30 h-full flex flex-col touch-manipulation"
      onClick={() => onPlay(game)}
    >
      {/* Game Thumbnail - Optimized for mobile */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Mobile-friendly action buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <Button
            size="sm"
            variant="ghost"
            className="h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 touch-target"
            onClick={(e) => {
              e.stopPropagation();
              onFavorite(game.id);
            }}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-10 w-10 p-0 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 touch-target"
            onClick={(e) => {
              e.stopPropagation();
              onShare(game);
            }}
          >
            <Share className="h-4 w-4" />
          </Button>
        </div>

        {/* Enhanced Play Button - Mobile optimized */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            size="lg"
            className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 text-white shadow-2xl transform hover:scale-105 transition-all duration-300 min-h-[44px] min-w-[120px]"
          >
            <Play className="h-5 w-5 mr-2" />
            Play Now
          </Button>
        </div>

        {/* Status and stats badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          <Badge className="bg-green-500 hover:bg-green-500 text-white shadow-lg">
            <div className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></div>
            LIVE
          </Badge>
          {gameStats && gameStats.plays > 10 && (
            <Badge className="bg-blue-500/80 text-white text-xs">
              {gameStats.plays} plays
            </Badge>
          )}
        </div>

        <Badge 
          variant="outline" 
          className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm text-xs"
        >
          {game.difficulty}
        </Badge>
      </div>
      
      {/* Game Info - Mobile optimized spacing */}
      <CardHeader className="pb-2 flex-shrink-0 p-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base md:text-lg line-clamp-1 group-hover:text-unigames-purple transition-colors">
            {game.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span className="text-sm font-medium">{gameStats?.rating || 4.8}</span>
          </div>
        </div>
        <CardDescription className="text-sm line-clamp-2">
          {game.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0 flex-grow flex flex-col justify-end p-4">
        <div className="flex justify-between items-center text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span className="text-xs md:text-sm">{game.playTime}</span>
          </div>
          <Badge variant="secondary" className="text-xs capitalize">
            {game.category}
          </Badge>
        </div>
        
        {/* Mobile-friendly features */}
        <div className="space-y-2 mb-3">
          <div className="flex flex-wrap gap-1">
            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
              📱 Mobile Ready
            </Badge>
            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
              🎨 HD Graphics
            </Badge>
          </div>
        </div>
        
        {/* Enhanced Action Button - Touch friendly */}
        <Button 
          className="w-full min-h-[44px] bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80 transition-all duration-300 group-hover:shadow-lg transform group-hover:scale-105 touch-target"
          onClick={(e) => {
            e.stopPropagation();
            onPlay(game);
          }}
        >
          <Play className="h-4 w-4 mr-2" />
          Play Game
        </Button>
      </CardContent>
    </Card>
  );
}
