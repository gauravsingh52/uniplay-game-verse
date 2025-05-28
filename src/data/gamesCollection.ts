export interface MiniGame {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: 'arcade' | 'puzzle' | 'strategy' | 'action' | 'sports' | 'racing' | 'adventure' | 'casual';
  difficulty: 'easy' | 'medium' | 'hard';
  playTime: string;
  isActive: boolean;
  videoUrl?: string;
  features?: string[];
  uniqueFeatures?: string[];
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
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-snake',
    uniqueFeatures: ['AI-powered difficulty scaling', 'Multiplayer mode', 'Custom snake skins']
  },
  {
    id: 'flappy-bird',
    title: 'Flappy Bird',
    description: 'Navigate through pipes by tapping to fly!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'hard',
    playTime: '1-3 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-flappy',
    uniqueFeatures: ['Weather effects', 'Character customization', 'Seasonal themes']
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe',
    description: 'Classic 3x3 grid game for two players',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'strategy',
    difficulty: 'easy',
    playTime: '1-2 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-tictactoe',
    uniqueFeatures: ['3D board visualization', 'AI difficulty levels', 'Tournament mode']
  },
  {
    id: 'memory-match',
    title: 'Memory Match',
    description: 'Find matching pairs in this memory game',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '3-5 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-memory',
    uniqueFeatures: ['Brain training analytics', 'Custom card themes', 'Progressive difficulty']
  },
  {
    id: '2048',
    title: '2048 Puzzle',
    description: 'Combine numbers to reach 2048!',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '5-10 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-2048',
    uniqueFeatures: ['Undo moves', 'Save game state', 'Custom grid sizes']
  },
  {
    id: 'pong',
    title: 'Pong Classic',
    description: 'The original arcade game!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'easy',
    playTime: '2-5 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-pong',
    uniqueFeatures: ['Retro visual effects', 'Power-ups', 'Tournament brackets']
  },
  {
    id: 'brick-breaker',
    title: 'Brick Breaker',
    description: 'Break all the bricks with your ball!',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'medium',
    playTime: '5-10 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-breakout',
    uniqueFeatures: ['Physics-based gameplay', 'Special brick types', 'Level editor']
  },
  {
    id: 'tetris',
    title: 'Tetris Classic',
    description: 'Stack falling blocks to clear lines!',
    thumbnail: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '5-15 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-tetris',
    uniqueFeatures: ['Ghost piece preview', 'Hold function', 'Marathon mode']
  },
  {
    id: 'connect-four',
    title: 'Connect Four',
    description: 'Get four in a row to win!',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'strategy',
    difficulty: 'medium',
    playTime: '3-8 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-connect4',
    uniqueFeatures: ['3D board effects', 'AI strategy hints', 'Online multiplayer']
  },
  {
    id: 'space-invaders',
    title: 'Space Invaders',
    description: 'Defend Earth from alien invasion!',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    category: 'action',
    difficulty: 'medium',
    playTime: '5-10 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-spaceinvaders',
    uniqueFeatures: ['Particle effects', 'Boss battles', 'Weapon upgrades']
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
  },
  // NEW GAMES START HERE
  {
    id: 'maze-runner',
    title: 'Maze Runner',
    description: 'Navigate through challenging mazes!',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '3-8 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-maze',
    uniqueFeatures: ['Procedural maze generation', 'Mini-map view', 'Time trial mode']
  },
  {
    id: 'tower-defense',
    title: 'Tower Defense',
    description: 'Build towers to defend your base!',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    category: 'strategy',
    difficulty: 'hard',
    playTime: '10-20 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-tower',
    uniqueFeatures: ['Real-time strategy', 'Multiple tower types', 'Wave preview system']
  },
  {
    id: 'word-search',
    title: 'Word Search',
    description: 'Find hidden words in the grid!',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'easy',
    playTime: '5-12 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-wordsearch',
    uniqueFeatures: ['Dynamic word generation', 'Category themes', 'Hint system']
  },
  {
    id: 'solitaire',
    title: 'Solitaire Classic',
    description: 'Classic card game solitaire!',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'casual',
    difficulty: 'medium',
    playTime: '8-15 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-solitaire',
    uniqueFeatures: ['Multiple solitaire variants', 'Card animation effects', 'Statistics tracking']
  },
  {
    id: 'crossword',
    title: 'Crossword Puzzle',
    description: 'Solve crossword puzzles!',
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'hard',
    playTime: '15-30 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-crossword',
    uniqueFeatures: ['Daily puzzles', 'Difficulty scaling', 'Hint reveals']
  },
  {
    id: 'jump-game',
    title: 'Endless Jump',
    description: 'Jump as high as you can!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'medium',
    playTime: '2-8 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-jump',
    uniqueFeatures: ['Parallax scrolling', 'Power-up collection', 'Character unlocks']
  },
  {
    id: 'sliding-puzzle',
    title: 'Sliding Puzzle',
    description: 'Rearrange tiles to complete the image!',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '3-10 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-sliding',
    uniqueFeatures: ['Custom image upload', 'Grid size options', 'Move counter']
  },
  {
    id: 'match-3',
    title: 'Match 3 Gems',
    description: 'Match three or more gems in a row!',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'easy',
    playTime: '5-15 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-match3',
    uniqueFeatures: ['Cascade combos', 'Special gem effects', 'Level progression']
  },
  {
    id: 'blackjack',
    title: 'Blackjack 21',
    description: 'Beat the dealer in this card game!',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'casual',
    difficulty: 'medium',
    playTime: '3-8 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-blackjack',
    uniqueFeatures: ['Card counting helper', 'Strategy suggestions', 'Tournament mode']
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: 'Clear the field without hitting mines!',
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'hard',
    playTime: '5-15 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-minesweeper',
    uniqueFeatures: ['Custom grid sizes', 'First click guarantee', 'Pattern recognition hints']
  },
  {
    id: 'simon-says',
    title: 'Simon Says',
    description: 'Remember and repeat the sequence!',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '2-10 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-simon',
    uniqueFeatures: ['Sound pattern memory', 'Increasing complexity', 'Visual effects']
  },
  {
    id: 'whack-a-mole',
    title: 'Whack-a-Mole',
    description: 'Hit the moles as they pop up!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'easy',
    playTime: '1-5 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-whack',
    uniqueFeatures: ['Reaction time tracking', 'Special mole types', 'Combo multipliers']
  },
  {
    id: 'chess',
    title: 'Chess Master',
    description: 'Play chess against AI or friends!',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop',
    category: 'strategy',
    difficulty: 'hard',
    playTime: '10-60 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-chess',
    uniqueFeatures: ['Multiple AI difficulty levels', 'Move analysis', 'Opening book database']
  },
  {
    id: 'bubble-pop',
    title: 'Bubble Pop',
    description: 'Pop colorful bubbles to clear the board!',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
    category: 'casual',
    difficulty: 'easy',
    playTime: '3-8 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-bubble',
    uniqueFeatures: ['Physics-based bubbles', 'Chain reaction effects', 'Color blind support']
  },
  {
    id: 'runner-game',
    title: 'Endless Runner',
    description: 'Run as far as you can!',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    category: 'arcade',
    difficulty: 'medium',
    playTime: '2-10 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-runner',
    uniqueFeatures: ['Procedural level generation', 'Character customization', 'Daily challenges']
  },
  {
    id: 'color-match',
    title: 'Color Match',
    description: 'Match colors before time runs out!',
    thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=300&fit=crop',
    category: 'puzzle',
    difficulty: 'medium',
    playTime: '2-6 min',
    isActive: true,
    videoUrl: 'https://player.vimeo.com/video/sample-colormatch',
    uniqueFeatures: ['Color theory education', 'Accessibility modes', 'Progressive difficulty']
  }
];
