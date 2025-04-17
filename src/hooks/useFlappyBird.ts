
import { useState, useEffect, useRef, useCallback } from 'react';

interface GameState {
  birdPosition: number;
  pipeHeight: number;
  pipeX: number;
  score: number;
  gameOver: boolean;
  highScore: number;
}

export const useFlappyBird = () => {
  const [gameState, setGameState] = useState<GameState>({
    birdPosition: 250,
    pipeHeight: 200,
    pipeX: 400,
    score: 0,
    gameOver: false,
    highScore: 0,
  });
  const gameLoopRef = useRef<number>();
  const [isPlaying, setIsPlaying] = useState(false);

  const jump = useCallback(() => {
    if (!gameState.gameOver) {
      setGameState((prev) => ({
        ...prev,
        birdPosition: Math.max(prev.birdPosition - 50, 0),
      }));
    }
  }, [gameState.gameOver]);

  const startGame = () => {
    setGameState({
      birdPosition: 250,
      pipeHeight: 200,
      pipeX: 400,
      score: 0,
      gameOver: false,
      highScore: gameState.highScore,
    });
    setIsPlaying(true);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        if (!isPlaying) {
          startGame();
        } else {
          jump();
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [isPlaying, jump]);

  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = () => {
      setGameState((prev) => {
        if (prev.gameOver) return prev;

        const nextPipeX = prev.pipeX - 3;
        let nextScore = prev.score;
        let nextHighScore = prev.highScore;

        // Check collision
        const birdRect = {
          left: 50,
          right: 80,
          top: prev.birdPosition,
          bottom: prev.birdPosition + 30,
        };

        const upperPipeRect = {
          left: prev.pipeX,
          right: prev.pipeX + 50,
          top: 0,
          bottom: prev.pipeHeight,
        };

        const lowerPipeRect = {
          left: prev.pipeX,
          right: prev.pipeX + 50,
          top: prev.pipeHeight + 150,
          bottom: 600,
        };

        const hasCollided =
          (birdRect.right > upperPipeRect.left &&
            birdRect.left < upperPipeRect.right &&
            birdRect.top < upperPipeRect.bottom) ||
          (birdRect.right > lowerPipeRect.left &&
            birdRect.left < lowerPipeRect.right &&
            birdRect.bottom > lowerPipeRect.top) ||
          prev.birdPosition > 570;

        // Update score when passing pipe
        if (prev.pipeX + 50 < 50 && prev.pipeX + 53 >= 50) {
          nextScore = prev.score + 1;
          if (nextScore > prev.highScore) {
            nextHighScore = nextScore;
          }
        }

        // Reset pipe position
        const nextPipe = nextPipeX < -50 ? 400 : nextPipeX;
        const nextPipeHeight = nextPipeX < -50 ? Math.random() * 300 + 100 : prev.pipeHeight;

        if (hasCollided) {
          setIsPlaying(false);
          return {
            ...prev,
            gameOver: true,
            highScore: nextHighScore,
          };
        }

        return {
          ...prev,
          birdPosition: Math.min(prev.birdPosition + 2, 570),
          pipeX: nextPipe,
          pipeHeight: nextPipeHeight,
          score: nextScore,
          highScore: nextHighScore,
        };
      });

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [isPlaying]);

  return {
    ...gameState,
    isPlaying,
    jump,
    startGame,
  };
};
