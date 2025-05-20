
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Play, Star } from "lucide-react";
import { Game } from '@/data/gamesData';
import { cn } from '@/lib/utils';

interface GameCardProps {
  game: Game;
  featured?: boolean;
}

const GameCard = ({ game, featured = false }: GameCardProps) => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };

  if (featured) {
    return (
      <div 
        className="relative w-full rounded-xl overflow-hidden cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70 z-10"></div>
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
          <h3 className="text-2xl font-bold text-white mb-2">{game.title}</h3>
          <div className="flex items-center space-x-2 mb-3">
            {game.category.map((cat, index) => (
              <span key={index} className="px-2 py-1 bg-unigames-purple/50 rounded-full text-xs text-white">
                {cat}
              </span>
            ))}
          </div>
          <p className="text-gray-300 mb-4 line-clamp-2">{game.description}</p>
          <Button className={cn(
            "bg-unigames-purple hover:bg-unigames-purple/80 button-glow transition-all duration-300",
            isHovering ? "translate-y-0 opacity-100" : "translate-y-2 opacity-90"
          )}>
            <Play className="mr-2 h-4 w-4" /> Play Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="game-card h-full flex flex-col cursor-pointer"
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4 z-10">
          <Button 
            className={cn(
              "bg-unigames-purple hover:bg-unigames-purple/80 button-glow w-full transition-all duration-300",
              isHovering ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            )}
          >
            <Play className="mr-2 h-4 w-4" /> Play Now
          </Button>
        </div>
        {game.rating >= 4.5 && (
          <div className="absolute top-2 right-2 bg-yellow-500/90 text-white text-xs px-2 py-1 rounded-full flex items-center z-10">
            <Star className="h-3 w-3 mr-1 fill-current" />
            Top Rated
          </div>
        )}
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <h3 className="font-bold mb-1 line-clamp-1">{game.title}</h3>
        <div className="flex items-center space-x-2 mb-2 flex-wrap">
          {game.category.slice(0, 2).map((cat, index) => (
            <span key={index} className="px-2 py-0.5 bg-muted rounded-full text-xs">
              {cat}
            </span>
          ))}
          {game.category.length > 2 && (
            <span className="text-xs text-muted-foreground">+{game.category.length - 2}</span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm text-yellow-400 flex items-center">
            <Star className="h-3 w-3 fill-current mr-1" />
            {game.rating.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">{game.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
