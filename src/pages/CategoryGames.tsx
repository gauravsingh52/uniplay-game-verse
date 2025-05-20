
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { getGamesByCategory, getAllCategories } from '@/data/gamesData';
import GameCard from '@/components/GameCard';
import { Button } from '@/components/ui/button';
import { ChevronRight, Filter, ArrowLeft } from 'lucide-react';
import CategoryFilter from '@/components/CategoryFilter';

const CategoryGames = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryName || 'All');
  const navigate = useNavigate();
  
  useEffect(() => {
    if (categoryName) {
      setLoading(true);
      setSelectedCategory(categoryName);
      
      // Simulate loading delay
      setTimeout(() => {
        const categoryGames = getGamesByCategory(categoryName);
        setGames(categoryGames);
        setLoading(false);
      }, 300);
    }
  }, [categoryName]);
  
  const handleCategorySelect = (category: string) => {
    if (category === 'All') {
      navigate('/browse');
    } else {
      navigate(`/category/${category}`);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-12 px-4 md:px-8">
        <div className="flex items-center mb-2 text-sm">
          <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
            Categories
          </Link>
          <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
          <span className="font-medium">{categoryName}</span>
        </div>
        
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">{categoryName} Games</h1>
            <p className="text-muted-foreground">Browse our collection of {categoryName?.toLowerCase()} games</p>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
        
        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} />
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-muted rounded-lg animate-pulse" style={{height: '260px'}}></div>
            ))}
          </div>
        ) : (
          <>
            {games.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">No games found</h2>
                <p className="text-muted-foreground mb-4">We couldn't find any games in this category</p>
                <Button onClick={() => window.history.back()}>Go Back</Button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {games.length} {games.length === 1 ? 'game' : 'games'}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {games.map((game) => (
                    <GameCard key={game.id} game={game} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CategoryGames;
