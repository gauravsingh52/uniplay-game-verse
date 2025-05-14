
export interface Game {
  id: string;
  title: string;
  category: string[];
  description: string;
  thumbnail: string;
  streamUrl: string;
  featured: boolean;
  rating: number;
  releaseYear: number;
}

export const gamesData: Game[] = [
  {
    id: "1",
    title: "Cosmic Odyssey",
    category: ["Action", "Adventure"],
    description: "Embark on an epic journey through the cosmos. Battle alien forces and discover ancient civilizations as you travel through space-time continuum.",
    thumbnail: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    streamUrl: "https://example.com/stream/cosmic-odyssey",
    featured: true,
    rating: 4.8,
    releaseYear: 2023,
  },
  {
    id: "2",
    title: "Neon Racers",
    category: ["Racing", "Arcade"],
    description: "Race through futuristic neon-lit cities with gravity-defying vehicles. Customize your racer and compete in global tournaments.",
    thumbnail: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    streamUrl: "https://example.com/stream/neon-racers",
    featured: true,
    rating: 4.5,
    releaseYear: 2022,
  },
  {
    id: "3",
    title: "Phantom Protocol",
    category: ["Stealth", "Action"],
    description: "Infiltrate high-security facilities as an elite agent with enhanced abilities. Complete missions without leaving a trace.",
    thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    streamUrl: "https://example.com/stream/phantom-protocol",
    featured: true,
    rating: 4.6,
    releaseYear: 2023,
  },
  {
    id: "4",
    title: "Digital Legends",
    category: ["RPG", "Strategy"],
    description: "Build your legend in a vast digital world. Form alliances, conquer territories, and rise to power in this immersive RPG experience.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    streamUrl: "https://example.com/stream/digital-legends",
    featured: false,
    rating: 4.7,
    releaseYear: 2022,
  },
  {
    id: "5",
    title: "Cyber Siege",
    category: ["Strategy", "Simulation"],
    description: "Command advanced robotic armies in futuristic warfare. Deploy tactical strategies to outmaneuver your opponents.",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    streamUrl: "https://example.com/stream/cyber-siege",
    featured: false,
    rating: 4.4,
    releaseYear: 2023,
  },
  {
    id: "6",
    title: "Frontier Explorers",
    category: ["Adventure", "Survival"],
    description: "Explore uncharted territories in a procedurally generated world. Discover resources, build settlements, and survive the wilderness.",
    thumbnail: "https://images.unsplash.com/photo-1500673922987-e212871fec22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    streamUrl: "https://example.com/stream/frontier-explorers",
    featured: false,
    rating: 4.3,
    releaseYear: 2022,
  },
  {
    id: "7",
    title: "Code Warriors",
    category: ["Puzzle", "Educational"],
    description: "Solve complex coding puzzles in a gamified environment. Learn programming concepts while advancing through challenging levels.",
    thumbnail: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    streamUrl: "https://example.com/stream/code-warriors",
    featured: false,
    rating: 4.2,
    releaseYear: 2023,
  },
  {
    id: "8",
    title: "Mystic Realms",
    category: ["RPG", "Fantasy"],
    description: "Journey through magical lands filled with mythical creatures. Master arcane spells and become a legendary sorcerer.",
    thumbnail: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    streamUrl: "https://example.com/stream/mystic-realms",
    featured: true,
    rating: 4.9,
    releaseYear: 2023,
  },
  {
    id: "9",
    title: "Tech Tycoon",
    category: ["Simulation", "Strategy"],
    description: "Build and manage your own tech empire. Develop innovative products, expand your business, and dominate the market.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    streamUrl: "https://example.com/stream/tech-tycoon",
    featured: false,
    rating: 4.1,
    releaseYear: 2022,
  },
  {
    id: "10",
    title: "Quantum Breach",
    category: ["Action", "Shooter"],
    description: "Fight in a world where quantum physics allows for mind-bending combat capabilities. Master the art of quantum manipulation.",
    thumbnail: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    streamUrl: "https://example.com/stream/quantum-breach",
    featured: true,
    rating: 4.7,
    releaseYear: 2023,
  }
];

export const getAllCategories = (): string[] => {
  const categoriesSet = new Set<string>();
  
  gamesData.forEach(game => {
    game.category.forEach(category => {
      categoriesSet.add(category);
    });
  });
  
  return Array.from(categoriesSet).sort();
};

export const getFeaturedGames = (): Game[] => {
  return gamesData.filter(game => game.featured);
};

export const getGamesByCategory = (category: string): Game[] => {
  return gamesData.filter(game => game.category.includes(category));
};

export const getGameById = (id: string): Game | undefined => {
  return gamesData.find(game => game.id === id);
};

export const searchGames = (query: string): Game[] => {
  const lowerCaseQuery = query.toLowerCase();
  return gamesData.filter(game => 
    game.title.toLowerCase().includes(lowerCaseQuery) || 
    game.description.toLowerCase().includes(lowerCaseQuery) ||
    game.category.some(cat => cat.toLowerCase().includes(lowerCaseQuery))
  );
};
