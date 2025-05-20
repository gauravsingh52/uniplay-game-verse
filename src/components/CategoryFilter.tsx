
import { Button } from "@/components/ui/button";
import { getAllCategories } from '@/data/gamesData';
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  useEffect(() => {
    // Get categories and set them
    const allCategories = ['All', ...getAllCategories()];
    setCategories(allCategories);
  }, []);
  
  return (
    <div className="mb-6 w-full relative">
      {/* Mobile dropdown filter for small screens */}
      <div className="block md:hidden w-full">
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full flex justify-between items-center">
              <span className="flex items-center">
                <Filter className="w-4 h-4 mr-2" /> 
                {selectedCategory === 'All' ? 'All Categories' : selectedCategory}
              </span>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px] max-h-[60vh] overflow-auto">
            <DropdownMenuLabel>Select Category</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category} 
                className={cn(
                  selectedCategory === category ? "bg-muted" : "",
                  "cursor-pointer"
                )}
                onClick={() => {
                  onSelectCategory(category);
                  setIsDropdownOpen(false);
                }}
              >
                {category}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Horizontal scrollable categories for larger screens */}
      <div className="hidden md:block">
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
    </div>
  );
};

export default CategoryFilter;
