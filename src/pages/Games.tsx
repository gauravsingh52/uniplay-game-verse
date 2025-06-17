
import Navbar from '@/components/Navbar';
import EnhancedGamesSection from '@/components/EnhancedGamesSection';

const Games = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20 pb-16">
        <div className="container mx-auto max-w-7xl">
          <EnhancedGamesSection />
        </div>
      </div>
    </div>
  );
};

export default Games;
