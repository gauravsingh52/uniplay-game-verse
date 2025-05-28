
export interface MiniGame {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: 'arcade' | 'puzzle' | 'strategy' | 'action' | 'sports' | 'racing';
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
    isActive: true
  },
  {
    id: 'pong',
    title: 'Pong Classic',
    description: 'The original arcade game!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'easy',
    playTime: '2-5 min',
    isActive: true
  },
  {
    id: 'brick-breaker',
    title: 'Brick Breaker',
    description: 'Break all the bricks with your ball!',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'medium',
    playTime: '5-10 min',
    isActive: true
  },
  {
    id: 'tetris',
    title: 'Tetris Classic',
    description: 'Stack falling blocks to clear lines!',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '5-15 min',
    isActive: true
  },
  {
    id: 'connect-four',
    title: 'Connect Four',
    description: 'Get four in a row to win!',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'strategy',
    difficulty: 'medium',
    playTime: '3-8 min',
    isActive: true
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders',
    description: 'Defend Earth from alien invasion!',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    category: 'action',
    difficulty: 'medium',
    playTime: '5-10 min',
    isActive: true
  },
  {
    id: 'frogger',
    title: 'Frogger',
    description: 'Help the frog cross the busy road!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'medium',
    playTime: '3-7 min',
    isActive: true
  },
  {
    id: 'pacman',
    title: 'Pac-Man',
    description: 'Eat dots and avoid the ghosts!',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'medium',
    playTime: '5-10 min',
    isActive: true
  },
  {
    id: 'asteroids',
    title: 'Asteroids',
    description: 'Destroy asteroids in space!',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    category: 'action',
    difficulty: 'hard',
    playTime: '5-12 min',
    isActive: true
  },
  {
    id: 'centipede',
    title: 'Centipede',
    description: 'Shoot the centipede before it reaches you!',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    category: 'action',
    difficulty: 'hard',
    playTime: '3-8 min',
    isActive: true
  },
  {
    id: 'doodle-jump',
    title: 'Doodle Jump',
    description: 'Jump as high as you can!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'medium',
    playTime: '2-10 min',
    isActive: true
  },
  {
    id: 'bubble-shooter',
    title: 'Bubble Shooter',
    description: 'Match bubbles to pop them!',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'easy',
    playTime: '3-8 min',
    isActive: true
  },
  {
    id: 'chess',
    title: 'Chess',
    description: 'Classic strategy game for two players',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'strategy',
    difficulty: 'hard',
    playTime: '10-60 min',
    isActive: true
  },
  {
    id: 'checkers',
    title: 'Checkers',
    description: 'Jump over opponent pieces to win!',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'strategy',
    difficulty: 'medium',
    playTime: '5-20 min',
    isActive: true
  },
  {
    id: 'racing-game',
    title: 'Speed Racer',
    description: 'Race against time on the highway!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'racing',
    difficulty: 'medium',
    playTime: '3-8 min',
    isActive: true
  },
  {
    id: 'pinball',
    title: 'Pinball Machine',
    description: 'Keep the ball in play and score points!',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'hard',
    playTime: '5-15 min',
    isActive: true
  }
];
