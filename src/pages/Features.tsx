
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad, 
  Zap, 
  Users, 
  Trophy, 
  Smartphone, 
  Shield, 
  Star, 
  Crown,
  Heart,
  Share,
  Volume2,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: Zap,
      title: "Instant Play",
      description: "No downloads, no installations. Click and play immediately in your browser.",
      color: "bg-yellow-500",
      benefits: ["Zero wait time", "Works on any device", "Always up-to-date"]
    },
    {
      icon: Gamepad,
      title: "13+ Premium Games",
      description: "Curated collection of high-quality games across multiple genres.",
      color: "bg-blue-500",
      benefits: ["Puzzle games", "Arcade classics", "Strategy games"]
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Every game works perfectly on mobile devices with touch controls.",
      color: "bg-green-500",
      benefits: ["Touch controls", "Responsive design", "Portrait & landscape"]
    },
    {
      icon: Users,
      title: "Social Gaming",
      description: "Share scores, compete with friends, and join the gaming community.",
      color: "bg-purple-500",
      benefits: ["Share achievements", "Compare scores", "Friend challenges"]
    }
  ];

  const premiumFeatures = [
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Unlock badges and track your gaming progress",
      status: "Live"
    },
    {
      icon: Crown,
      title: "Leaderboards",
      description: "Compete globally and see where you rank",
      status: "Live"
    },
    {
      icon: Heart,
      title: "Favorites System",
      description: "Save and organize your favorite games",
      status: "Live"
    },
    {
      icon: Share,
      title: "Game Sharing",
      description: "Share games with friends via social media",
      status: "Live"
    },
    {
      icon: Volume2,
      title: "Sound & Music",
      description: "Immersive audio experience in every game",
      status: "Live"
    },
    {
      icon: Settings,
      title: "Customizable Controls",
      description: "Adjust controls and settings for each game",
      status: "Live"
    }
  ];

  const gameCategories = [
    {
      name: "Puzzle Games",
      count: 4,
      description: "Brain-training puzzles and logic games",
      games: ["2048", "Memory Match", "Tetris", "15-Puzzle"]
    },
    {
      name: "Arcade Games",
      count: 5,
      description: "Fast-paced action and classic arcade fun",
      games: ["Snake", "Flappy Bird", "Pong", "Brick Breaker", "Bubble Bop"]
    },
    {
      name: "Strategy Games",
      count: 2,
      description: "Think ahead and plan your moves",
      games: ["Tic Tac Toe", "Plant Panic"]
    },
    {
      name: "Adventure Games",
      count: 2,
      description: "Explore worlds and complete quests",
      games: ["Zoo Zoom", "Snail Sprint"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-unigames-purple/20 to-unigames-blue/20 backdrop-blur-sm border border-unigames-purple/30 rounded-full px-4 py-2 text-sm font-medium mb-4">
              <Star className="w-4 h-4 text-unigames-purple animate-pulse" />
              <span>Premium Gaming Platform</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-unigames-purple to-unigames-blue bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover what makes UNIGAMES the ultimate destination for browser gaming. 
              No downloads, no hassle – just pure gaming fun at your fingertips.
            </p>
          </div>

          {/* Main Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {mainFeatures.map((feature, index) => (
              <Card key={index} className="hover:shadow-xl transition-all duration-300 border-2 hover:border-unigames-purple/30">
                <CardHeader className="text-center pb-3">
                  <div className={`w-14 h-14 ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 bg-unigames-purple rounded-full mr-2"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Game Categories */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Game Categories</h2>
              <p className="text-muted-foreground">Explore our diverse collection of games</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {gameCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                      onClick={() => navigate('/games')}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <Badge variant="secondary">{category.count} games</Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      {category.games.map((game, i) => (
                        <div key={i} className="text-sm text-muted-foreground flex items-center">
                          <Gamepad className="w-3 h-3 mr-2 text-unigames-purple" />
                          {game}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Premium Features Grid */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Premium Features</h2>
              <p className="text-muted-foreground">Advanced gaming features included for free</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumFeatures.map((feature, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow duration-300">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-unigames-purple to-unigames-blue rounded-lg flex items-center justify-center mr-3">
                      <feature.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{feature.title}</CardTitle>
                      <Badge 
                        variant={feature.status === 'Live' ? 'default' : 'secondary'}
                        className="text-xs mt-1"
                      >
                        {feature.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <Card className="bg-gradient-to-r from-unigames-purple/10 to-unigames-blue/10 border-unigames-purple/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">Ready to Start Gaming?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of players already enjoying our premium gaming experience. 
                No downloads, no subscriptions, just instant fun!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-unigames-purple to-unigames-blue hover:from-unigames-purple/80 hover:to-unigames-blue/80"
                  onClick={() => navigate('/games')}
                >
                  <Gamepad className="h-5 w-5 mr-2" />
                  Play Games Now
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/signup')}>
                  <Users className="h-5 w-5 mr-2" />
                  Create Free Account
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <Badge variant="outline">100% Free</Badge>
                <Badge variant="outline">No Downloads</Badge>
                <Badge variant="outline">Mobile Friendly</Badge>
                <Badge variant="outline">13+ Games</Badge>
                <Badge variant="outline">Regular Updates</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Features;
