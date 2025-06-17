
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, RotateCcw, Volume2, VolumeX, Home, Trophy, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GameState {
  score: number;
  level: number;
  lives: number;
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  timeElapsed: number;
  highScore: number;
}

export interface GameEngineProps {
  gameId: string;
  title: string;
  description: string;
  children: React.ReactNode;
  gameState: GameState;
  onStateChange: (state: Partial<GameState>) => void;
  onRestart: () => void;
  onExit: () => void;
  controls?: React.ReactNode;
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
  showTimer?: boolean;
  showLives?: boolean;
  showLevel?: boolean;
  customStats?: { label: string; value: string | number }[];
}

const GameEngine: React.FC<GameEngineProps> = ({
  gameId,
  title,
  description,
  children,
  gameState,
  onStateChange,
  onRestart,
  onExit,
  controls,
  soundEnabled = true,
  onSoundToggle,
  showTimer = true,
  showLives = true,
  showLevel = true,
  customStats = []
}) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number>();

  // Handle responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      if (gameContainerRef.current) {
        const container = gameContainerRef.current;
        const rect = container.getBoundingClientRect();
        setDimensions({
          width: rect.width,
          height: Math.min(rect.height, window.innerHeight * 0.7)
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Game timer
  useEffect(() => {
    if (gameState.isPlaying && !gameState.isPaused && !gameState.isGameOver) {
      timerRef.current = window.setInterval(() => {
        onStateChange({ timeElapsed: gameState.timeElapsed + 1 });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameState.isPlaying, gameState.isPaused, gameState.isGameOver, gameState.timeElapsed, onStateChange]);

  // Save high score
  useEffect(() => {
    if (gameState.isGameOver && gameState.score > gameState.highScore) {
      const newHighScore = gameState.score;
      localStorage.setItem(`${gameId}_highScore`, newHighScore.toString());
      onStateChange({ highScore: newHighScore });
    }
  }, [gameState.isGameOver, gameState.score, gameState.highScore, gameId, onStateChange]);

  const handlePlayPause = () => {
    if (!gameState.isPlaying) {
      onStateChange({ isPlaying: true, isPaused: false });
    } else {
      onStateChange({ isPaused: !gameState.isPaused });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case ' ':
      case 'p':
      case 'P':
        event.preventDefault();
        handlePlayPause();
        break;
      case 'r':
      case 'R':
        if (gameState.isGameOver) {
          event.preventDefault();
          onRestart();
        }
        break;
      case 'Escape':
        event.preventDefault();
        onExit();
        break;
    }
  }, [gameState.isGameOver, handlePlayPause, onRestart, onExit]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Game Header */}
      <div className="flex-shrink-0 p-4 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-gray-300">{description}</p>
          </div>
          <div className="flex items-center gap-2">
            {onSoundToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onSoundToggle}
                className="text-white hover:bg-white/20"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onExit}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{gameState.score.toLocaleString()}</div>
            <div className="text-gray-300">Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{gameState.highScore.toLocaleString()}</div>
            <div className="text-gray-300">High Score</div>
          </div>
          {showLevel && (
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{gameState.level}</div>
              <div className="text-gray-300">Level</div>
            </div>
          )}
          {showLives && (
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{gameState.lives}</div>
              <div className="text-gray-300">Lives</div>
            </div>
          )}
          {showTimer && (
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">{formatTime(gameState.timeElapsed)}</div>
              <div className="text-gray-300">Time</div>
            </div>
          )}
          {customStats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
              <div className="text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative overflow-hidden" ref={gameContainerRef}>
        {/* Game Canvas/Content */}
        <div className="absolute inset-0">
          {children}
        </div>

        {/* Game Over Overlay */}
        {gameState.isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <Card className="bg-gray-900/90 border-gray-700 text-white max-w-md w-full mx-4">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl font-bold mb-2">Game Over!</CardTitle>
                <div className="space-y-2">
                  <div className="text-xl text-yellow-400">
                    Final Score: {gameState.score.toLocaleString()}
                  </div>
                  {gameState.score === gameState.highScore && (
                    <Badge className="bg-gold-500 text-black animate-pulse">
                      <Trophy className="h-4 w-4 mr-1" />
                      New High Score!
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-blue-400">{gameState.level}</div>
                    <div className="text-sm text-gray-300">Level Reached</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-purple-400">{formatTime(gameState.timeElapsed)}</div>
                    <div className="text-sm text-gray-300">Time Played</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={onRestart} className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Play Again
                  </Button>
                  <Button variant="outline" onClick={onExit} className="flex-1">
                    <Home className="h-4 w-4 mr-2" />
                    Exit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pause Overlay */}
        {gameState.isPaused && !gameState.isGameOver && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-40">
            <Card className="bg-gray-900/90 border-gray-700 text-white">
              <CardContent className="p-8 text-center">
                <div className="text-4xl font-bold mb-4">Paused</div>
                <div className="text-gray-300 mb-6">Press SPACE or click to resume</div>
                <Button onClick={handlePlayPause} size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  Resume
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Game Controls */}
      <div className="flex-shrink-0 p-4 bg-black/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePlayPause}
              disabled={gameState.isGameOver}
              className="text-white border-white/30 hover:bg-white/20"
            >
              {gameState.isPlaying && !gameState.isPaused ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {gameState.isPlaying && !gameState.isPaused ? 'Pause' : 'Play'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRestart}
              className="text-white border-white/30 hover:bg-white/20"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Restart
            </Button>
          </div>
          
          {/* Custom Controls */}
          {controls && (
            <div className="flex items-center gap-2">
              {controls}
            </div>
          )}
          
          {/* Mobile/Touch indicators */}
          <div className="hidden md:block text-xs text-gray-400">
            SPACE: Pause • R: Restart • ESC: Exit
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameEngine;
