
import Navbar from '@/components/Navbar';
import { EnhancedGamesPage } from '@/components/EnhancedGamesPage';

const Games = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-16 px-2 sm:px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <EnhancedGamesPage />
        </div>
      </div>
    </div>
  );
};

export default Games;
