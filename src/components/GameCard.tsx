
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Game } from '@/data/gamesData';

interface GameCardProps {
  game: Game;
  featured?: boolean;
}

const GameCard = ({ game, featured = false }: GameCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/game/${game.id}`);
  };

  if (featured) {
    return (
      <div 
        className="relative w-full rounded-xl overflow-hidden cursor-pointer group"
        onClick={handleClick}
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
          <Button className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow">
            <Play className="mr-2 h-4 w-4" /> Play Now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="game-card cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative aspect-[3/4]">
        <img 
          src={game.thumbnail} 
          alt={game.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <Button className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow">
            <Play className="mr-2 h-4 w-4" /> Play
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold mb-1 line-clamp-1">{game.title}</h3>
        <div className="flex items-center space-x-2 mb-2">
          {game.category.slice(0, 2).map((cat, index) => (
            <span key={index} className="px-2 py-0.5 bg-muted rounded-full text-xs">
              {cat}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-yellow-400">★ {game.rating.toFixed(1)}</span>
          <span className="text-sm text-muted-foreground">{game.releaseYear}</span>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
