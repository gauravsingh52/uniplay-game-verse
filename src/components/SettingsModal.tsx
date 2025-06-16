
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Volume2, Gamepad2, Globe, Shield, Palette, X } from "lucide-react";
import { useTheme } from '@/hooks/useTheme';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState({
    volume: [75],
    preferredCategories: ['Action', 'Puzzle'],
    language: 'en',
    keyboardEnabled: true,
    gamepadEnabled: false,
    notifications: true,
    analytics: false,
    autoplay: true
  });

  const gameCategories = [
    'Action', 'Puzzle', 'Strategy', 'Racing', 'Sports', 
    'Arcade', 'Horror', 'Adventure', 'Platformer', 'Multiplayer'
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' }
  ];

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('unigames-settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings);
    localStorage.setItem('unigames-settings', JSON.stringify(newSettings));
  };

  const toggleCategory = (category: string) => {
    const newCategories = settings.preferredCategories.includes(category)
      ? settings.preferredCategories.filter(c => c !== category)
      : [...settings.preferredCategories, category];
    
    saveSettings({ ...settings, preferredCategories: newCategories });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto glass-effect">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-unigames-purple" />
            Settings
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Appearance Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-unigames-purple" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Theme</Label>
                <Select value={theme} onValueChange={(value) => setTheme(value as 'light' | 'dark')}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light Mode</SelectItem>
                    <SelectItem value="dark">Dark Mode</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Language</Label>
                <Select value={settings.language} onValueChange={(value) => saveSettings({ ...settings, language: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4" />
                          {lang.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-unigames-purple" />
                Audio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Master Volume</Label>
                  <span className="text-sm text-muted-foreground">{settings.volume[0]}%</span>
                </div>
                <Slider
                  value={settings.volume}
                  onValueChange={(value) => saveSettings({ ...settings, volume: value })}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Auto-play Games</Label>
                  <p className="text-xs text-muted-foreground">Automatically start game audio</p>
                </div>
                <Switch
                  checked={settings.autoplay}
                  onCheckedChange={(checked) => saveSettings({ ...settings, autoplay: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Game Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-unigames-purple" />
                Game Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-3 block">Preferred Categories</Label>
                <div className="flex flex-wrap gap-2">
                  {gameCategories.map((category) => (
                    <Badge
                      key={category}
                      variant={settings.preferredCategories.includes(category) ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        settings.preferredCategories.includes(category)
                          ? 'bg-unigames-purple hover:bg-unigames-purple/80'
                          : 'hover:bg-unigames-purple/10'
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Keyboard Controls</Label>
                  <p className="text-xs text-muted-foreground">Enable keyboard shortcuts</p>
                </div>
                <Switch
                  checked={settings.keyboardEnabled}
                  onCheckedChange={(checked) => saveSettings({ ...settings, keyboardEnabled: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Gamepad Support</Label>
                  <p className="text-xs text-muted-foreground">Enable controller input</p>
                </div>
                <Switch
                  checked={settings.gamepadEnabled}
                  onCheckedChange={(checked) => saveSettings({ ...settings, gamepadEnabled: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-unigames-purple" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Notifications</Label>
                  <p className="text-xs text-muted-foreground">Get updates about new games</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => saveSettings({ ...settings, notifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Analytics</Label>
                  <p className="text-xs text-muted-foreground">Help improve the platform</p>
                </div>
                <Switch
                  checked={settings.analytics}
                  onCheckedChange={(checked) => saveSettings({ ...settings, analytics: checked })}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" className="w-full" size="sm">
                  Download My Data
                </Button>
                <Button variant="destructive" className="w-full" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-gradient-to-r from-unigames-purple to-unigames-blue" onClick={onClose}>
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
