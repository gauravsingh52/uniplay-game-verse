
import { useState, useEffect, useCallback } from 'react';
import { GameState } from './GameEngine';

export interface UseGameEngineProps {
  gameId: string;
  initialLives?: number;
  initialLevel?: number;
  levelUpScore?: number;
}

export const useGameEngine = ({
  gameId,
  initialLives = 3,
  initialLevel = 1,
  levelUpScore = 1000
}: UseGameEngineProps) => {
  const [gameState, setGameState] = useState<GameState>(() => {
    const savedHighScore = localStorage.getItem(`${gameId}_highScore`);
    return {
      score: 0,
      level: initialLevel,
      lives: initialLives,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      timeElapsed: 0,
      highScore: savedHighScore ? parseInt(savedHighScore) : 0
    };
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem(`${gameId}_soundEnabled`);
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save sound preference
  useEffect(() => {
    localStorage.setItem(`${gameId}_soundEnabled`, JSON.stringify(soundEnabled));
  }, [gameId, soundEnabled]);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState(prev => {
      const newState = { ...prev, ...updates };
      
      // Auto level up based on score
      if (updates.score !== undefined && levelUpScore > 0) {
        const newLevel = Math.floor(updates.score / levelUpScore) + initialLevel;
        if (newLevel > prev.level) {
          newState.level = newLevel;
        }
      }
      
      // Game over when lives reach 0
      if (updates.lives !== undefined && updates.lives <= 0) {
        newState.isGameOver = true;
        newState.isPlaying = false;
        newState.isPaused = false;
      }
      
      return newState;
    });
  }, [levelUpScore, initialLevel]);

  const restartGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: 0,
      level: initialLevel,
      lives: initialLives,
      isPlaying: false,
      isPaused: false,
      isGameOver: false,
      timeElapsed: 0
    }));
  }, [initialLevel, initialLives]);

  const addScore = useCallback((points: number) => {
    updateGameState({ score: gameState.score + points });
  }, [gameState.score, updateGameState]);

  const loseLife = useCallback(() => {
    updateGameState({ lives: gameState.lives - 1 });
  }, [gameState.lives, updateGameState]);

  const playSound = useCallback((frequency: number, duration: number = 100) => {
    if (!soundEnabled) return;
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Audio not supported', error);
    }
  }, [soundEnabled]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  return {
    gameState,
    updateGameState,
    restartGame,
    addScore,
    loseLife,
    playSound,
    soundEnabled,
    toggleSound
  };
};
