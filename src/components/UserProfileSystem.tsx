
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Star, Gamepad2, Crown, Award, Edit, User } from 'lucide-react';

interface UserProfile {
  nickname: string;
  avatar: string;
  totalPlays: number;
  favoriteGame: string;
  joinDate: string;
  achievements: Achievement[];
  highScores: Record<string, number>;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

const defaultAchievements: Achievement[] = [
  {
    id: 'first-game',
    name: 'First Steps',
    description: 'Play your first game',
    icon: '🎮'
  },
  {
    id: 'game-explorer',
    name: 'Game Explorer',
    description: 'Play 5 different games',
    icon: '🗺️'
  },
  {
    id: 'dedicated-player',
    name: 'Dedicated Player',
    description: 'Play 25 games total',
    icon: '🏆'
  },
  {
    id: 'high-scorer',
    name: 'High Scorer',
    description: 'Get a high score in any game',
    icon: '⭐'
  },
  {
    id: 'snake-master',
    name: 'Snake Master',
    description: 'Score 100+ in Snake',
    icon: '🐍'
  },
  {
    id: 'tetris-champion',
    name: 'Tetris Champion',
    description: 'Clear 10 lines in Tetris',
    icon: '🧩'
  }
];

const avatarOptions = [
  '👤', '🎮', '🎯', '🎲', '🎪', '🚀', '⚡', '🔥', '💎', '🌟',
  '🎨', '🎭', '🎪', '🎯', '🎲', '🎮', '🕹️', '🎊', '🎉', '🏆'
];

export function UserProfileSystem() {
  const [profile, setProfile] = useState<UserProfile>({
    nickname: 'Anonymous Player',
    avatar: '👤',
    totalPlays: 0,
    favoriteGame: '',
    joinDate: new Date().toISOString().split('T')[0],
    achievements: [],
    highScores: {}
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [tempNickname, setTempNickname] = useState(profile.nickname);
  const [tempAvatar, setTempAvatar] = useState(profile.avatar);

  useEffect(() => {
    // Load profile from localStorage
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }

    // Check for new achievements based on game stats
    const gameStats = localStorage.getItem('gameStats');
    if (gameStats) {
      checkAchievements(JSON.parse(gameStats));
    }
  }, []);

  const checkAchievements = (gameStats: Record<string, any>) => {
    const totalPlays = Object.values(gameStats).reduce((sum: number, stats: any) => sum + (stats.plays || 0), 0);
    const gamesPlayed = Object.keys(gameStats).length;
    
    const newAchievements = [...profile.achievements];
    
    // Check various achievement conditions
    if (totalPlays >= 1 && !newAchievements.find(a => a.id === 'first-game')) {
      newAchievements.push({...defaultAchievements.find(a => a.id === 'first-game')!, unlockedAt: new Date().toISOString()});
    }
    
    if (gamesPlayed >= 5 && !newAchievements.find(a => a.id === 'game-explorer')) {
      newAchievements.push({...defaultAchievements.find(a => a.id === 'game-explorer')!, unlockedAt: new Date().toISOString()});
    }
    
    if (totalPlays >= 25 && !newAchievements.find(a => a.id === 'dedicated-player')) {
      newAchievements.push({...defaultAchievements.find(a => a.id === 'dedicated-player')!, unlockedAt: new Date().toISOString()});
    }

    if (newAchievements.length > profile.achievements.length) {
      const updatedProfile = { ...profile, achievements: newAchievements, totalPlays };
      setProfile(updatedProfile);
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    }
  };

  const saveProfile = () => {
    const updatedProfile = { ...profile, nickname: tempNickname, avatar: tempAvatar };
    setProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
    setIsEditing(false);
  };

  const getPlayerLevel = () => {
    if (profile.totalPlays < 5) return { level: 1, title: 'Newbie' };
    if (profile.totalPlays < 15) return { level: 2, title: 'Player' };
    if (profile.totalPlays < 30) return { level: 3, title: 'Gamer' };
    if (profile.totalPlays < 50) return { level: 4, title: 'Expert' };
    return { level: 5, title: 'Master' };
  };

  const playerLevel = getPlayerLevel();

  return (
    <Card className="bg-gradient-to-br from-unigames-purple/10 to-unigames-blue/10 border-unigames-purple/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-unigames-purple/30">
              <AvatarFallback className="text-2xl bg-gradient-to-br from-unigames-purple/20 to-unigames-blue/20">
                {profile.avatar}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                {profile.nickname}
                <Badge variant="outline" className="bg-unigames-purple/20 text-unigames-purple border-unigames-purple/30">
                  Level {playerLevel.level}
                </Badge>
              </CardTitle>
              <CardDescription className="text-base">
                {playerLevel.title} • {profile.totalPlays} games played
              </CardDescription>
            </div>
          </div>
          
          <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Your Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nickname</label>
                  <Input
                    value={tempNickname}
                    onChange={(e) => setTempNickname(e.target.value)}
                    placeholder="Enter your nickname"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Avatar</label>
                  <div className="grid grid-cols-10 gap-2">
                    {avatarOptions.map((avatar) => (
                      <Button
                        key={avatar}
                        variant={tempAvatar === avatar ? "default" : "outline"}
                        className="aspect-square p-2 text-lg"
                        onClick={() => setTempAvatar(avatar)}
                      >
                        {avatar}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button onClick={saveProfile} className="flex-1">Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Achievements Section */}
        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements ({profile.achievements.length}/{defaultAchievements.length})
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {defaultAchievements.map((achievement) => {
              const unlocked = profile.achievements.find(a => a.id === achievement.id);
              return (
                <div
                  key={achievement.id}
                  className={`relative group p-3 rounded-lg border text-center transition-all duration-200 ${
                    unlocked 
                      ? 'bg-unigames-purple/20 border-unigames-purple/30 hover:bg-unigames-purple/30' 
                      : 'bg-muted/50 border-muted-foreground/20 opacity-50'
                  }`}
                >
                  <div className="text-2xl mb-1">{achievement.icon}</div>
                  <div className="text-xs font-medium">{achievement.name}</div>
                  {unlocked && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-green-500">
                      ✓
                    </Badge>
                  )}
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    {achievement.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/20">
            <div className="text-2xl font-bold text-blue-500">{profile.totalPlays}</div>
            <div className="text-xs text-muted-foreground">Total Plays</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg border border-green-500/20">
            <div className="text-2xl font-bold text-green-500">{profile.achievements.length}</div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/20">
            <div className="text-2xl font-bold text-yellow-500">{playerLevel.level}</div>
            <div className="text-xs text-muted-foreground">Player Level</div>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
            <div className="text-2xl font-bold text-purple-500">
              {profile.joinDate ? Math.floor((Date.now() - new Date(profile.joinDate).getTime()) / (1000 * 60 * 60 * 24)) : 0}
            </div>
            <div className="text-xs text-muted-foreground">Days Playing</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
