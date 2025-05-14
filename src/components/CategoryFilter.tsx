
import { Button } from "@/components/ui/button";
import { getAllCategories } from '@/data/gamesData';

interface CategoryFilterProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategoryFilter = ({ selectedCategory, onSelectCategory }: CategoryFilterProps) => {
  const categories = ['All', ...getAllCategories()];
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          className={
            selectedCategory === category 
              ? "bg-unigames-purple hover:bg-unigames-purple/80" 
              : "border-muted bg-card hover:bg-muted"
          }
          onClick={() => onSelectCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
