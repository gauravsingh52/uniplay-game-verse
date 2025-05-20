
import { Button } from "@/components/ui/button";
import { getAllCategories } from '@/data/gamesData';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  const categories = ['All', ...getAllCategories()];
  
  return (
    <div className="mb-6 w-full relative">
      <ScrollArea className="w-full whitespace-nowrap pb-3">
        <div className="flex flex-row space-x-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                selectedCategory === category 
                  ? "bg-unigames-purple hover:bg-unigames-purple/80" 
                  : "border-muted bg-card hover:bg-muted",
                "min-w-fit transition-all duration-300"
              )}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </ScrollArea>
      
      {/* Gradient fade effect on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

export default CategoryFilter;
