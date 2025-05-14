
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Play, Star, ArrowLeft, Bookmark } from "lucide-react";
import Navbar from '@/components/Navbar';
import GameCard from '@/components/GameCard';
import { getGameById, getGamesByCategory, Game } from '@/data/gamesData';

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<Game | null>(null);
  const [relatedGames, setRelatedGames] = useState<Game[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundGame = getGameById(id);
      if (foundGame) {
        setGame(foundGame);
        
        if (foundGame.category.length > 0) {
          const category = foundGame.category[0];
          const related = getGamesByCategory(category)
            .filter(g => g.id !== id)
            .slice(0, 5);
          setRelatedGames(related);
        }
      }
    }
  }, [id]);

  const handlePlayNow = () => {
    setIsPlaying(true);
    // In a real app, this would connect to the cloud gaming service
  };

  const handleBack = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      navigate(-1);
    }
  };

  if (!game) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Game not found</h2>
          <Button 
            onClick={() => navigate('/')}
            className="bg-unigames-purple hover:bg-unigames-purple/80"
          >
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  if (isPlaying) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <div className="bg-black/80 p-4 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBack}
            className="text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Details
          </Button>
          <h2 className="text-white ml-4 font-bold">{game.title}</h2>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <div className="bg-muted w-full max-w-5xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg mb-4">Game streaming would load here...</p>
              <p className="text-sm text-muted-foreground">
                In a production app, this would connect to a cloud gaming service
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero section with game details */}
      <section className="pt-24 px-4 md:px-8 relative">
        <div className="absolute inset-0 overflow-hidden" style={{ zIndex: -1 }}>
          <img 
            src={game.thumbnail}
            alt={game.title}
            className="w-full h-[50vh] object-cover opacity-20 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 to-background"></div>
        </div>
        
        <div className="container mx-auto py-8">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={handleBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="order-2 md:order-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{game.title}</h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-yellow-400">
                  <Star className="fill-current h-5 w-5 mr-1" />
                  <span>{game.rating.toFixed(1)}</span>
                </div>
                <div className="text-muted-foreground">{game.releaseYear}</div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {game.category.map((cat, index) => (
                  <span key={index} className="px-3 py-1 bg-muted rounded-full text-sm">
                    {cat}
                  </span>
                ))}
              </div>
              
              <p className="text-gray-300 mb-8">
                {game.description}
              </p>
              
              <div className="flex space-x-4">
                <Button 
                  size="lg" 
                  className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow"
                  onClick={handlePlayNow}
                >
                  <Play className="mr-2 h-5 w-5" /> Play Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-muted"
                >
                  <Bookmark className="mr-2 h-5 w-5" /> Add to Favorites
                </Button>
              </div>
            </div>
            
            <div className="order-1 md:order-2">
              <div className="rounded-lg overflow-hidden shadow-xl relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button 
                    size="lg" 
                    className="bg-unigames-purple hover:bg-unigames-purple/80 button-glow"
                    onClick={handlePlayNow}
                  >
                    <Play className="mr-2 h-5 w-5" /> Play Now
                  </Button>
                </div>
                <img 
                  src={game.thumbnail}
                  alt={game.title}
                  className="w-full object-cover aspect-video"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Game specifications */}
      <section className="py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold mb-6">System Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-4">Minimum Requirements</h3>
              <ul className="space-y-3 text-gray-300">
                <li><span className="text-muted-foreground">Connection:</span> 10 Mbps</li>
                <li><span className="text-muted-foreground">Device:</span> Any modern browser</li>
                <li><span className="text-muted-foreground">Operating System:</span> Windows, macOS, Chrome OS, Linux</li>
                <li><span className="text-muted-foreground">Processor:</span> Any dual-core processor</li>
              </ul>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="font-semibold mb-4">Recommended</h3>
              <ul className="space-y-3 text-gray-300">
                <li><span className="text-muted-foreground">Connection:</span> 20+ Mbps</li>
                <li><span className="text-muted-foreground">Device:</span> Chrome or Edge browser</li>
                <li><span className="text-muted-foreground">Operating System:</span> Windows 10/11, macOS 10.15+</li>
                <li><span className="text-muted-foreground">Processor:</span> Any quad-core processor</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Related games */}
      {relatedGames.length > 0 && (
        <section className="py-12 px-4 md:px-8">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-6">Similar Games</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {relatedGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default GameDetails;
