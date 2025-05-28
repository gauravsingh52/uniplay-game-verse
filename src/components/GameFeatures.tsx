
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Zap, Users, Trophy, Gamepad, Sparkles } from 'lucide-react';

interface GameFeaturesProps {
  features?: string[];
  uniqueFeatures?: string[];
  className?: string;
}

const GameFeatures = ({ features = [], uniqueFeatures = [], className = '' }: GameFeaturesProps) => {
  const getFeatureIcon = (feature: string) => {
    if (feature.toLowerCase().includes('multiplayer') || feature.toLowerCase().includes('online')) {
      return <Users className="h-3 w-3" />;
    }
    if (feature.toLowerCase().includes('ai') || feature.toLowerCase().includes('smart')) {
      return <Zap className="h-3 w-3" />;
    }
    if (feature.toLowerCase().includes('tournament') || feature.toLowerCase().includes('score')) {
      return <Trophy className="h-3 w-3" />;
    }
    if (feature.toLowerCase().includes('effect') || feature.toLowerCase().includes('visual')) {
      return <Sparkles className="h-3 w-3" />;
    }
    return <Star className="h-3 w-3" />;
  };

  return (
    <Card className={`${className}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {uniqueFeatures.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Gamepad className="h-4 w-4 text-unigames-purple" />
                Exclusive Features
              </h4>
              <div className="flex flex-wrap gap-1">
                {uniqueFeatures.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="default"
                    className="text-xs bg-gradient-to-r from-unigames-purple to-unigames-blue text-white"
                  >
                    {getFeatureIcon(feature)}
                    <span className="ml-1">{feature}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {features.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2">Standard Features</h4>
              <div className="flex flex-wrap gap-1">
                {features.map((feature, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs"
                  >
                    {getFeatureIcon(feature)}
                    <span className="ml-1">{feature}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GameFeatures;
