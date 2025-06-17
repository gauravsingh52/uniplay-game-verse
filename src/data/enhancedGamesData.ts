
export interface EnhancedGame {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  playTime: string;
  players: string;
  featured: boolean;
  controls: string[];
  tags: string[];
}

export const enhancedGames: EnhancedGame[] = [
  {
    id: 'enhanced-snake',
    title: 'Snake Classic',
    description: 'Guide the snake to eat food and grow longer without hitting walls or yourself',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    category: ['Arcade', 'Classic'],
    difficulty: 'Medium',
    rating: 4.5,
    playTime: '5-15 min',
    players: '1 Player',
    featured: true,
    controls: ['Arrow Keys', 'WASD', 'Touch'],
    tags: ['retro', 'classic', 'arcade']
  },
  {
    id: 'enhanced-tetris',
    title: 'Tetris Blocks',
    description: 'Stack falling blocks to create complete lines and clear the board',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=400&h=300',
    category: ['Puzzle', 'Classic'],
    difficulty: 'Medium',
    rating: 4.7,
    playTime: '10-30 min',
    players: '1 Player',
    featured: true,
    controls: ['Arrow Keys', 'Space', 'Touch'],
    tags: ['puzzle', 'blocks', 'classic']
  },
  {
    id: 'enhanced-puzzle',
    title: '15-Puzzle Slider',
    description: 'Slide numbered tiles to arrange them in the correct order',
    thumbnail: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?auto=format&fit=crop&w=400&h=300',
    category: ['Puzzle', 'Brain'],
    difficulty: 'Hard',
    rating: 4.2,
    playTime: '5-20 min',
    players: '1 Player',
    featured: false,
    controls: ['Mouse', 'Touch'],
    tags: ['puzzle', 'logic', 'brain']
  },
  {
    id: 'bubble-bop',
    title: 'Bubble Bop',
    description: 'Pop colorful bubbles that match the target color before time runs out',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    category: ['Arcade', 'Action'],
    difficulty: 'Easy',
    rating: 4.3,
    playTime: '2-5 min',
    players: '1 Player',
    featured: false,
    controls: ['Mouse', 'Touch'],
    tags: ['colorful', 'fast-paced', 'arcade']
  },
  {
    id: 'jelly-stack',
    title: 'Jelly Stack',
    description: 'Stack bouncy jelly blocks as high as possible without toppling the tower',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=400&h=300',
    category: ['Arcade', 'Physics'],
    difficulty: 'Medium',
    rating: 4.1,
    playTime: '3-10 min',
    players: '1 Player',
    featured: false,
    controls: ['Mouse', 'Touch', 'Space'],
    tags: ['physics', 'stacking', 'colorful']
  }
];

export const getGamesByCategory = (category: string) => {
  if (category === 'all') return enhancedGames;
  return enhancedGames.filter(game => 
    game.category.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
};

export const getFeaturedGames = () => {
  return enhancedGames.filter(game => game.featured);
};

export const searchGames = (query: string) => {
  const searchTerm = query.toLowerCase();
  return enhancedGames.filter(game =>
    game.title.toLowerCase().includes(searchTerm) ||
    game.description.toLowerCase().includes(searchTerm) ||
    game.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
    game.category.some(cat => cat.toLowerCase().includes(searchTerm))
  );
};
