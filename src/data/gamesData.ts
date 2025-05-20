
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

// Helper function to create game thumbnails from a set of image URLs
const getRandomThumbnail = () => {
  const thumbnails = [
    "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1500673922987-e212871fec22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1585620385456-4759f9b5c7d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400"
  ];
  return thumbnails[Math.floor(Math.random() * thumbnails.length)];
};

// Generate 100 games with proper categorization
const generateGames = (): Game[] => {
  const categories = [
    "Action", "Adventure", "Arcade", "Board", "Card", "Casino", "Casual", 
    "Educational", "Family", "Fighting", "Indie", "Multiplayer", "Music", 
    "Puzzle", "Racing", "Role Playing", "Shooter", "Simulation", "Sports", 
    "Strategy", "Trivia", "Word"
  ];
  
  const actionGameTitles = ["Epic Combat", "Adrenaline Rush", "Battle Zone", "Warrior's Path", "Quick Strike", "Combat Masters", "Rapid Fire", "Tactical Assault", "Frontline Heroes", "Ultimate Warrior"];
  const adventureGameTitles = ["Lost Horizons", "Mystic Quest", "Journey Beyond", "Epic Odyssey", "Hidden Realms", "Forgotten Paths", "Treasure Hunter", "Quest for Glory", "Ancient Secrets", "Unexplored Worlds"];
  const arcadeGameTitles = ["Pixel Blast", "Retro Zone", "Classic Challenge", "Neon Arcade", "Bit Crusher", "8-Bit Heroes", "Coin Rush", "High Score", "Pixelated Fun", "Quarter Eater"];
  const puzzleGameTitles = ["Mind Bender", "Logic Challenge", "Brain Teaser", "Puzzle Master", "Pattern Solver", "Mind Games", "Critical Thinking", "Clever Blocks", "Mental Challenge", "Enigma Solver"];
  const strategyGameTitles = ["Empire Builder", "Command & Conquer", "Master Tactician", "Strategic Mind", "Grand Conquest", "Battle Planner", "Domination", "World Ruler", "Resource Empire", "Tactical Genius"];
  const sportsGameTitles = ["Championship Pro", "Athletic Challenge", "Sports Fever", "MVP Tournament", "Olympic Glory", "Stadium Stars", "League Champions", "Pro Season", "Ultimate Tournament", "Gold Medal"];
  const racingGameTitles = ["Speed Demons", "Turbo Racers", "Velocity Rush", "Fast Lane", "Nitro Boost", "Speed Champions", "Racing Evolution", "Circuit Masters", "Drag Racers", "Asphalt Legends"];
  const simulationGameTitles = ["Life Simulator", "City Builder", "Farm Days", "Business Tycoon", "Hospital Manager", "Airport Controller", "Zoo Keeper", "Restaurant Boss", "Space Station", "Theme Park"];
  const rpgGameTitles = ["Fantasy Realms", "Dragon Quest", "Hero's Journey", "Mythic Legends", "Character Builder", "Epic Adventures", "Level Up", "Magic & Monsters", "Dungeon Explorer", "Enchanted Realms"];
  const educationalGameTitles = ["Knowledge Quest", "Learning Adventure", "Brain Boost", "Smart Skills", "Educational Challenge", "Math Master", "Science Explorer", "Geography Whiz", "History Heroes", "Language Learn"];
  
  const gameTitlesByCategory: Record<string, string[]> = {
    "Action": actionGameTitles,
    "Adventure": adventureGameTitles,
    "Arcade": arcadeGameTitles,
    "Puzzle": puzzleGameTitles,
    "Strategy": strategyGameTitles,
    "Sports": sportsGameTitles,
    "Racing": racingGameTitles,
    "Simulation": simulationGameTitles,
    "Role Playing": rpgGameTitles,
    "Educational": educationalGameTitles
  };
  
  const gameDescriptions = [
    "Engage in an immersive experience with stunning graphics and challenging gameplay.",
    "Explore vast worlds filled with adventure, mystery, and hidden treasures.",
    "Test your reflexes and skills in fast-paced action and thrilling challenges.",
    "Solve complex puzzles and overcome obstacles using logic and critical thinking.",
    "Build your empire, manage resources, and outsmart your opponents.",
    "Compete against friends or AI in realistic sports simulation and tournaments.",
    "Race through diverse tracks and environments with customizable vehicles.",
    "Experience realistic simulation with detailed mechanics and authentic systems.",
    "Embark on an epic journey, level up your character, and defeat powerful enemies.",
    "Learn new skills while having fun in engaging educational gameplay."
  ];
  
  let games: Game[] = [];
  let id = 1;
  
  // First, create 10 games for each major category
  const majorCategories = ["Action", "Adventure", "Arcade", "Puzzle", "Strategy", "Sports", "Racing", "Simulation", "Role Playing", "Educational"];
  
  majorCategories.forEach(category => {
    const titles = gameTitlesByCategory[category] || ["Game"];
    
    for (let i = 0; i < 10; i++) {
      const title = titles[i] || `${category} Game ${i+1}`;
      const secondaryCategory = categories[Math.floor(Math.random() * categories.length)];
      const gameCategories = [category];
      
      // Add a secondary category that's different from the primary
      if (secondaryCategory !== category) {
        gameCategories.push(secondaryCategory);
      }
      
      // Randomly add a third category sometimes
      if (Math.random() > 0.7) {
        const tertiaryCategory = categories[Math.floor(Math.random() * categories.length)];
        if (!gameCategories.includes(tertiaryCategory)) {
          gameCategories.push(tertiaryCategory);
        }
      }
      
      const releaseYear = Math.floor(Math.random() * 3) + 2022; // Between 2022-2024
      const rating = (3 + Math.random() * 2).toFixed(1); // Between 3.0-5.0
      const featured = Math.random() > 0.8; // 20% chance to be featured
      
      games.push({
        id: id.toString(),
        title,
        category: gameCategories,
        description: gameDescriptions[Math.floor(Math.random() * gameDescriptions.length)],
        thumbnail: getRandomThumbnail(),
        streamUrl: `https://example.com/stream/${title.toLowerCase().replace(/\s+/g, '-')}`,
        featured,
        rating: parseFloat(rating),
        releaseYear
      });
      
      id++;
    }
  });
  
  return games;
};

export const gamesData: Game[] = generateGames();

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

export const getNewestGames = (): Game[] => {
  return [...gamesData].sort((a, b) => b.releaseYear - a.releaseYear);
};

export const getTopRatedGames = (): Game[] => {
  return [...gamesData].sort((a, b) => b.rating - a.rating);
};

export const getRandomGames = (count: number): Game[] => {
  const shuffled = [...gamesData].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
