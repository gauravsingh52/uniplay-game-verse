
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Zap, Coffee, Music, Gamepad2 } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

interface MoodTheme {
  id: string;
  name: string;
  emoji: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  effects: string[];
}

const moodThemes: MoodTheme[] = [
  {
    id: 'chill',
    name: 'Chill Mode',
    emoji: '😌',
    description: 'Calm and relaxed gaming',
    colors: {
      primary: 'from-blue-400 to-blue-600',
      secondary: 'from-cyan-400 to-blue-500',
      accent: 'bg-blue-500'
    },
    effects: ['Slow animations', 'Calm music', 'Soft shadows']
  },
  {
    id: 'hype',
    name: 'Hype Mode',
    emoji: '🔥',
    description: 'High energy gaming',
    colors: {
      primary: 'from-red-500 to-orange-600',
      secondary: 'from-pink-500 to-red-500',
      accent: 'bg-red-500'
    },
    effects: ['Fast animations', 'Neon colors', 'Quick transitions']
  },
  {
    id: 'focus',
    name: 'Focus Mode',
    emoji: '🎯',
    description: 'Minimal distractions',
    colors: {
      primary: 'from-green-400 to-green-600',
      secondary: 'from-emerald-400 to-green-500',
      accent: 'bg-green-500'
    },
    effects: ['Clean UI', 'No animations', 'Monochrome']
  },
  {
    id: 'party',
    name: 'Party Mode',
    emoji: '🎉',
    description: 'Fun and colorful',
    colors: {
      primary: 'from-purple-500 to-pink-600',
      secondary: 'from-indigo-500 to-purple-500',
      accent: 'bg-purple-500'
    },
    effects: ['Rainbow colors', 'Bouncy animations', 'Celebration sounds']
  },
  {
    id: 'retro',
    name: 'Retro Mode',
    emoji: '👾',
    description: 'Classic gaming vibes',
    colors: {
      primary: 'from-yellow-400 to-orange-500',
      secondary: 'from-amber-400 to-yellow-500',
      accent: 'bg-yellow-500'
    },
    effects: ['Pixel fonts', '8-bit sounds', 'CRT effects']
  }
];

export function MoodThemes() {
  const [selectedMood, setSelectedMood] = useState<string>('chill');
  const [isAutoMode, setIsAutoMode] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    // Load saved mood
    const savedMood = localStorage.getItem('selectedMood');
    if (savedMood) {
      setSelectedMood(savedMood);
    }

    // Auto-detect mood based on time
    const autoMode = localStorage.getItem('autoMoodMode') === 'true';
    setIsAutoMode(autoMode);

    if (autoMode) {
      detectMoodByTime();
    }
  }, []);

  const detectMoodByTime = () => {
    const hour = new Date().getHours();
    let autoMood = 'chill';

    if (hour >= 6 && hour < 12) {
      autoMood = 'focus'; // Morning focus
    } else if (hour >= 12 && hour < 17) {
      autoMood = 'hype'; // Afternoon energy
    } else if (hour >= 17 && hour < 21) {
      autoMood = 'party'; // Evening fun
    } else {
      autoMood = 'chill'; // Night chill
    }

    setSelectedMood(autoMood);
    localStorage.setItem('selectedMood', autoMood);
  };

  const handleMoodChange = (moodId: string) => {
    setSelectedMood(moodId);
    localStorage.setItem('selectedMood', moodId);
    setIsAutoMode(false);
    localStorage.setItem('autoMoodMode', 'false');

    // Apply mood effects to the page
    applyMoodEffects(moodId);
  };

  const toggleAutoMode = () => {
    const newAutoMode = !isAutoMode;
    setIsAutoMode(newAutoMode);
    localStorage.setItem('autoMoodMode', newAutoMode.toString());

    if (newAutoMode) {
      detectMoodByTime();
    }
  };

  const applyMoodEffects = (moodId: string) => {
    const mood = moodThemes.find(m => m.id === moodId);
    if (!mood) return;

    // Apply CSS custom properties for the mood
    const root = document.documentElement;
    root.style.setProperty('--mood-primary', mood.colors.primary);
    root.style.setProperty('--mood-secondary', mood.colors.secondary);
    root.style.setProperty('--mood-accent', mood.colors.accent);

    // Add mood class to body
    document.body.className = document.body.className.replace(/mood-\w+/g, '');
    document.body.classList.add(`mood-${moodId}`);
  };

  const currentMood = moodThemes.find(m => m.id === selectedMood);

  return (
    <Card className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Music className="h-5 w-5 text-indigo-500" />
          Mood Themes
          {currentMood && <span className="text-2xl">{currentMood.emoji}</span>}
        </CardTitle>
        <CardDescription>
          Choose your gaming mood or let us auto-detect based on time
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Auto Mode Toggle */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-lg border border-indigo-500/30">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Auto Mood Detection</span>
            {isAutoMode && <Badge variant="outline">Active</Badge>}
          </div>
          <Button
            variant={isAutoMode ? "default" : "outline"}
            size="sm"
            onClick={toggleAutoMode}
          >
            {isAutoMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>

        {/* Current Mood Display */}
        {currentMood && (
          <Card className={`bg-gradient-to-r ${currentMood.colors.secondary}/20 border-${currentMood.colors.accent.split('-')[1]}-500/30`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{currentMood.emoji}</span>
                <div>
                  <h3 className="font-semibold">{currentMood.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentMood.description}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {currentMood.effects.map((effect, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {effect}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mood Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {moodThemes.map((mood) => (
            <Button
              key={mood.id}
              variant={selectedMood === mood.id ? "default" : "outline"}
              className={`h-auto p-3 flex flex-col items-center gap-2 ${
                selectedMood === mood.id ? `bg-gradient-to-r ${mood.colors.primary}` : ''
              }`}
              onClick={() => handleMoodChange(mood.id)}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <div className="text-center">
                <div className="text-xs font-medium">{mood.name}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
