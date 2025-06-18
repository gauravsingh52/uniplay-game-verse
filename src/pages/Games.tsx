
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import { EnhancedWorkingGamesSection } from '@/components/EnhancedWorkingGamesSection';

const Games = () => {
  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavbar />
      
      <div className="pt-20 pb-16 px-2 sm:px-4 md:px-8">
        <div className="container mx-auto max-w-7xl">
          <EnhancedWorkingGamesSection />
        </div>
      </div>
    </div>
  );
};

export default Games;
