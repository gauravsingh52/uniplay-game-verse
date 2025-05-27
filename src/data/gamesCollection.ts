
export interface MiniGame {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: 'arcade' | 'puzzle' | 'strategy' | 'action';
  difficulty: 'easy' | 'medium' | 'hard';
  playTime: string;
  isActive: boolean;
}

export const miniGames: MiniGame[] = [
  {
    id: 'snake',
    title: 'Snake Classic',
    description: 'Eat food, grow longer, avoid hitting yourself!',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'easy',
    playTime: '2-5 min',
    isActive: true
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Navigate through pipes by tapping to fly!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'hard',
    playTime: '1-3 min',
    isActive: true
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic 3x3 grid game for two players',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'strategy',
    difficulty: 'easy',
    playTime: '1-2 min',
    isActive: true
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Find matching pairs in this memory game',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '3-5 min',
    isActive: true
  },
  {
    id: '2048',
    title: '2048 Puzzle',
    description: 'Combine numbers to reach 2048!',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '5-10 min',
    isActive: false
  },
  {
    id: 'pong',
    title: 'Pong Classic',
    description: 'The original arcade game!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'easy',
    playTime: '2-5 min',
    isActive: false
  },
  {
    id: 'brick-breaker',
    title: 'Brick Breaker',
    description: 'Break all the bricks with your ball!',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'medium',
    playTime: '5-10 min',
    isActive: false
  },
  {
    id: 'endless-runner',
    title: 'Endless Runner',
    description: 'Run, jump, and collect coins!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'action',
    difficulty: 'medium',
    playTime: '3-∞ min',
    isActive: false
  },
  {
    id: 'platformer',
    title: 'Jump Adventure',
    description: 'Platform jumping adventure game',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    category: 'action',
    difficulty: 'medium',
    playTime: '5-15 min',
    isActive: false
  },
  {
    id: 'racing',
    title: 'Speed Racer',
    description: 'Top-down racing action!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'action',
    difficulty: 'hard',
    playTime: '3-8 min',
    isActive: false
  }
];
