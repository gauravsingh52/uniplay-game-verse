
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { getAllCategories, getGamesByCategory } from '@/data/gamesData';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Categories = () => {
  const navigate = useNavigate();
  const categories = getAllCategories();
  
  // Function to get a sample image for each category
  const getCategoryImage = (category: string) => {
    const games = getGamesByCategory(category);
    return games.length > 0 ? games[0].thumbnail : '/placeholder.svg';
  };
  
  // Function to get game count for each category
  const getCategoryCount = (category: string) => {
    return getGamesByCategory(category).length;
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-12 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-2">Game Categories</h1>
        <p className="text-muted-foreground mb-8">Browse games by category</p>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <HoverCard key={category}>
              <HoverCardTrigger asChild>
                <Card 
                  className="overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-lg"
                  onClick={() => navigate(`/category/${category}`)}
                >
                  <div className="relative h-40">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10"></div>
                    <img 
                      src={getCategoryImage(category)} 
                      alt={category} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                      <h3 className="font-bold text-white text-lg">{category}</h3>
                      <p className="text-gray-300 text-sm">{getCategoryCount(category)} games</p>
                    </div>
                  </div>
                </Card>
              </HoverCardTrigger>
              <HoverCardContent className="w-80">
                <div className="space-y-2">
                  <h4 className="text-lg font-semibold">{category} Games</h4>
                  <p className="text-sm text-muted-foreground">
                    Browse our collection of {getCategoryCount(category)} {category.toLowerCase()} games.
                  </p>
                  <Button 
                    size="sm" 
                    className="w-full bg-unigames-purple hover:bg-unigames-purple/80"
                    onClick={() => navigate(`/category/${category}`)}
                  >
                    Browse {category}
                  </Button>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
