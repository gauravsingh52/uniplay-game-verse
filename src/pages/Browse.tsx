
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { gamesData, getAllCategories } from '@/data/gamesData';
import GameCard from '@/components/GameCard';
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Browse = () => {
  const [games, setGames] = useState(gamesData);
  const [filteredGames, setFilteredGames] = useState(gamesData);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [ratingFilter, setRatingFilter] = useState([0, 5]);
  const [loading, setLoading] = useState(true);
  const categories = ['All', ...getAllCategories()];

  useEffect(() => {
    // Simulating data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = [...games];
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(game => 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(game => game.category.includes(selectedCategory));
    }
    
    // Apply rating filter
    result = result.filter(game => 
      game.rating >= ratingFilter[0] && game.rating <= ratingFilter[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case "newest":
        result.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case "oldest":
        result.sort((a, b) => a.releaseYear - b.releaseYear);
        break;
      case "nameAsc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "nameDesc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "ratingAsc":
        result.sort((a, b) => a.rating - b.rating);
        break;
      case "ratingDesc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setFilteredGames(result);
  }, [games, searchQuery, selectedCategory, sortOption, ratingFilter]);

  const handleRatingChange = (values: number[]) => {
    setRatingFilter(values);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The search is already applied via the useEffect
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSortOption("newest");
    setRatingFilter([0, 5]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto pt-24 pb-12 px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-2">Browse All Games</h1>
        <p className="text-muted-foreground mb-8">Discover and play our collection of browser games</p>
        
        <Card className="mb-8">
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-4">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    type="text"
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </form>
              </div>
              
              <div className="md:col-span-2">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-3">
                <Select
                  value={sortOption}
                  onValueChange={setSortOption}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
                    <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
                    <SelectItem value="ratingDesc">Rating (High-Low)</SelectItem>
                    <SelectItem value="ratingAsc">Rating (Low-High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="md:col-span-2">
                <span className="block text-sm font-medium mb-1">Rating: {ratingFilter[0]} - {ratingFilter[1]}</span>
                <Slider
                  defaultValue={[0, 5]}
                  value={ratingFilter}
                  onValueChange={handleRatingChange}
                  min={0}
                  max={5}
                  step={0.5}
                  className="w-full"
                />
              </div>
              
              <div className="md:col-span-1">
                <Button 
                  variant="outline" 
                  onClick={handleReset}
                  className="w-full"
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-muted rounded-lg animate-pulse" style={{height: '260px'}}></div>
            ))}
          </div>
        ) : (
          <>
            {filteredGames.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-2">No games found</h2>
                <p className="text-muted-foreground mb-4">Try different search terms or filters</p>
                <Button variant="outline" onClick={handleReset}>Reset Filters</Button>
              </div>
            ) : (
              <>
                <p className="mb-4 text-muted-foreground">{filteredGames.length} games found</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {filteredGames.map((game) => (
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

export default Browse;
