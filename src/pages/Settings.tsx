
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResponsiveNavbar from '@/components/ResponsiveNavbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Settings as SettingsIcon, Bell, Moon, Sun, Globe, Shield, Save, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const [profile, setProfile] = useState({
    displayName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    bio: '',
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    emailUpdates: false,
    soundEffects: true,
    language: 'en',
    autoSave: true,
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleSavePreferences = () => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
    toast({
      title: "Preferences Saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <ResponsiveNavbar />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="hover:bg-unigames-purple/10"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <SettingsIcon className="h-8 w-8 text-unigames-purple" />
                Settings
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your account and preferences
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Settings */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal information and profile details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profile.displayName}
                        onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                        placeholder="Enter your display name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                        disabled={isAuthenticated}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <Button onClick={handleSaveProfile} className="bg-unigames-purple hover:bg-unigames-purple/80">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                  <CardDescription>
                    Customize your gaming experience and app behavior.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Theme */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Theme</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred theme
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      className="ml-4"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </>
                      ) : (
                        <>
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </>
                      )}
                    </Button>
                  </div>

                  <Separator />

                  {/* Notifications */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications for new games and updates
                      </p>
                    </div>
                    <Switch
                      checked={preferences.notifications}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, notifications: checked }))
                      }
                    />
                  </div>

                  {/* Email Updates */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Email Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get weekly updates about new games and features
                      </p>
                    </div>
                    <Switch
                      checked={preferences.emailUpdates}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, emailUpdates: checked }))
                      }
                    />
                  </div>

                  {/* Sound Effects */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Sound Effects</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable sound effects in games and interface
                      </p>
                    </div>
                    <Switch
                      checked={preferences.soundEffects}
                      onCheckedChange={(checked) => 
                        setPreferences(prev => ({ ...prev, soundEffects: checked }))
                      }
                    />
                  </div>

                  {/* Language */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Language</Label>
                      <p className="text-sm text-muted-foreground">
                        Choose your preferred language
                      </p>
                    </div>
                    <Select
                      value={preferences.language}
                      onValueChange={(value) => 
                        setPreferences(prev => ({ ...prev, language: value }))
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSavePreferences} variant="outline" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Status</span>
                        <Badge className="bg-green-500 hover:bg-green-500">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Games Played</span>
                        <Badge variant="secondary">12</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Member Since</span>
                        <span className="text-sm text-muted-foreground">Dec 2024</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Sign in to access more features
                      </p>
                      <Button
                        onClick={() => navigate('/login')}
                        className="bg-unigames-purple hover:bg-unigames-purple/80"
                      >
                        Sign In
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate('/support')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Help & Support
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => navigate('/games')}
                  >
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Browse Games
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => window.open('mailto:support@unigames.com')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
