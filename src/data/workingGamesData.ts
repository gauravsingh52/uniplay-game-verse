
export interface WorkingGame {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  playTime: string;
  rating: number;
  controls: string[];
  features: string[];
}

export const workingGames: WorkingGame[] = [
  {
    id: 'bubble-bop',
    title: 'Bubble Bop',
    description: 'Pop colorful bubbles in this addictive puzzle game. Match colors and clear the board!',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop&crop=center',
    category: 'Puzzle',
    difficulty: 'Easy',
    playTime: '5-15 min',
    rating: 4.6,
    controls: ['Mouse', 'Touch'],
    features: ['Score tracking', 'Sound effects', 'Responsive']
  },
  {
    id: 'snake',
    title: 'Snake Classic',
    description: 'The classic snake game! Eat food, grow longer, avoid walls and your own tail.',
    thumbnail: 'https://images.unsplash.com/photo-1516975476649-0ca5b136f05e?w=400&h=300&fit=crop&crop=center',
    category: 'Arcade',
    difficulty: 'Medium',
    playTime: '5-20 min',
    rating: 4.8,
    controls: ['Keyboard', 'Touch'],
    features: ['Score tracking', 'Levels', 'Sound effects']
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Navigate through pipes in this challenging endless runner. How far can you go?',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center',
    category: 'Arcade',
    difficulty: 'Hard',
    playTime: '2-10 min',
    rating: 4.3,
    controls: ['Keyboard', 'Touch', 'Mouse'],
    features: ['Endless gameplay', 'Score tracking', 'Physics']
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'The classic strategy game. Play against AI or challenge a friend locally.',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop&crop=center',
    category: 'Strategy',
    difficulty: 'Easy',
    playTime: '2-5 min',
    rating: 4.4,
    controls: ['Mouse', 'Touch'],
    features: ['AI opponent', 'Local multiplayer', 'Win detection']
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Test your memory! Flip cards to find matching pairs in this brain-training game.',
    thumbnail: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=400&h=300&fit=crop&crop=center',
    category: 'Puzzle',
    difficulty: 'Medium',
    playTime: '3-10 min',
    rating: 4.5,
    controls: ['Mouse', 'Touch'],
    features: ['Memory training', 'Multiple levels', 'Timer']
  },
  {
    id: '2048',
    title: '2048',
    description: 'Combine numbered tiles to reach 2048! Strategic thinking meets addictive gameplay.',
    thumbnail: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400&h=300&fit=crop&crop=center',
    category: 'Puzzle',
    difficulty: 'Medium',
    playTime: '10-30 min',
    rating: 4.7,
    controls: ['Keyboard', 'Touch', 'Mouse'],
    features: ['Score tracking', 'Undo moves', 'Save progress']
  },
  {
    id: 'pong',
    title: 'Pong Classic',
    description: 'The original arcade game! Control your paddle and beat the AI opponent.',
    thumbnail: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop&crop=center',
    category: 'Arcade',
    difficulty: 'Easy',
    playTime: '5-15 min',
    rating: 4.2,
    controls: ['Keyboard', 'Mouse'],
    features: ['AI opponent', 'Score tracking', 'Retro graphics']
  },
  {
    id: 'brick-breaker',
    title: 'Brick Breaker',
    description: 'Break all the bricks with your ball! Classic arcade action with power-ups.',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=center',
    category: 'Arcade',
    difficulty: 'Medium',
    playTime: '10-25 min',
    rating: 4.6,
    controls: ['Keyboard', 'Mouse', 'Touch'],
    features: ['Power-ups', 'Multiple levels', 'Physics']
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'The legendary puzzle game! Clear lines by fitting falling blocks together.',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop&crop=center',
    category: 'Puzzle',
    difficulty: 'Medium',
    playTime: '10-60 min',
    rating: 4.9,
    controls: ['Keyboard', 'Touch'],
    features: ['Line clearing', 'Speed increase', 'Score tracking']
  },
  {
    id: 'zoo-zoom',
    title: 'Zoo Zoom',
    description: 'Help animals escape the zoo in this fast-paced adventure game!',
    thumbnail: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=400&h=300&fit=crop&crop=center',
    category: 'Adventure',
    difficulty: 'Medium',
    playTime: '8-20 min',
    rating: 4.4,
    controls: ['Keyboard', 'Touch'],
    features: ['Multiple characters', 'Power-ups', 'Adventure mode']
  },
  {
    id: 'jelly-stack',
    title: 'Jelly Stack',
    description: 'Stack colorful jelly blocks as high as you can without toppling over!',
    thumbnail: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=300&fit=crop&crop=center',
    category: 'Arcade',
    difficulty: 'Easy',
    playTime: '5-15 min',
    rating: 4.3,
    controls: ['Mouse', 'Touch'],
    features: ['Physics simulation', 'High scores', 'Colorful graphics']
  },
  {
    id: 'snail-sprint',
    title: 'Snail Sprint',
    description: 'Race your snail through obstacle courses in this surprisingly fast-paced game!',
    thumbnail: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&crop=center',
    category: 'Racing',
    difficulty: 'Medium',
    playTime: '5-12 min',
    rating: 4.2,
    controls: ['Keyboard', 'Touch'],
    features: ['Racing mechanics', 'Obstacles', 'Time trials']
  },
  {
    id: 'plant-panic',
    title: 'Plant Panic',
    description: 'Defend your garden from invading pests in this tower defense style game!',
    thumbnail: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop&crop=center',
    category: 'Strategy',
    difficulty: 'Hard',
    playTime: '15-30 min',
    rating: 4.5,
    controls: ['Mouse', 'Touch'],
    features: ['Tower defense', 'Strategy gameplay', 'Multiple waves']
  }
];
