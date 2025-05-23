
import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const SCALE = 20;
const GAME_WIDTH = 400;
const GAME_HEIGHT = 400;

type SnakeSegment = {
  x: number;
  y: number;
};

type FoodPosition = {
  x: number;
  y: number;
};

type Direction = 'Up' | 'Down' | 'Left' | 'Right';

const SnakeGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  
  // Game state using refs to avoid re-renders during gameplay
  const gameStateRef = useRef({
    snake: {
      x: 0,
      y: 0,
      xSpeed: SCALE,
      ySpeed: 0,
      total: 0,
      tail: [] as SnakeSegment[],
    },
    food: { x: 0, y: 0 } as FoodPosition,
    gameLoopId: 0,
    gameSpeed: 150, // milliseconds between updates
    toastShown: false, // Flag to track if the toast has been shown
  });
  
  // Initialize game
  useEffect(() => {
    // Load high score from localStorage
    const savedHighScore = localStorage.getItem('snakeGameHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore, 10));
    }
    
    // Initialize food in a random position
    resetGame();
    
    return () => {
      // Clean up interval on component unmount
      if (gameStateRef.current.gameLoopId) {
        clearInterval(gameStateRef.current.gameLoopId);
      }
    };
  }, []);
  
  // Game controls event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dir = e.key.replace('Arrow', '') as Direction;
      if (['Up', 'Down', 'Left', 'Right'].includes(dir)) {
        changeDirection(dir);
      } else if (e.code === 'Space') {
        togglePause();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaused]);
  
  // Reset game to initial state
  const resetGame = () => {
    const gameState = gameStateRef.current;
    
    // Reset snake
    gameState.snake = {
      x: 0,
      y: 0,
      xSpeed: SCALE,
      ySpeed: 0,
      total: 0,
      tail: [],
    };
    
    // Place food in random position
    gameState.food = randomPosition();
    
    setScore(0);
    setIsGameOver(false);
    
    // Reset the toast shown flag
    gameState.toastShown = false;
    
    // Draw initial state
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawGame(ctx);
      }
    }
  };
  
  // Generate random position for food
  const randomPosition = (): FoodPosition => {
    const columns = GAME_WIDTH / SCALE;
    const rows = GAME_HEIGHT / SCALE;
    
    return {
      x: Math.floor(Math.random() * columns) * SCALE,
      y: Math.floor(Math.random() * rows) * SCALE,
    };
  };
  
  // Change snake direction
  const changeDirection = (dir: Direction) => {
    const snake = gameStateRef.current.snake;
    
    switch (dir) {
      case 'Up':
        if (snake.ySpeed === 0) {
          snake.xSpeed = 0;
          snake.ySpeed = -SCALE;
        }
        break;
      case 'Down':
        if (snake.ySpeed === 0) {
          snake.xSpeed = 0;
          snake.ySpeed = SCALE;
        }
        break;
      case 'Left':
        if (snake.xSpeed === 0) {
          snake.xSpeed = -SCALE;
          snake.ySpeed = 0;
        }
        break;
      case 'Right':
        if (snake.xSpeed === 0) {
          snake.xSpeed = SCALE;
          snake.ySpeed = 0;
        }
        break;
    }
  };
  
  // Start game loop
  const startGame = () => {
    if (isPaused) {
      setIsPaused(false);
      
      // Clear any existing interval
      if (gameStateRef.current.gameLoopId) {
        clearInterval(gameStateRef.current.gameLoopId);
      }
      
      // Start new game loop
      const gameLoopId = window.setInterval(() => {
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            updateGame(ctx);
          }
        }
      }, gameStateRef.current.gameSpeed);
      
      gameStateRef.current.gameLoopId = gameLoopId;
    }
  };
  
  // Pause game
  const pauseGame = () => {
    if (!isPaused) {
      setIsPaused(true);
      clearInterval(gameStateRef.current.gameLoopId);
      gameStateRef.current.gameLoopId = 0;
    }
  };
  
  // Toggle pause state
  const togglePause = () => {
    if (isGameOver) {
      resetGame();
      startGame();
    } else {
      isPaused ? startGame() : pauseGame();
    }
  };
  
  // Update game state
  const updateGame = (ctx: CanvasRenderingContext2D) => {
    const gameState = gameStateRef.current;
    const { snake, food } = gameState;
    
    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    
    // Update snake tail positions
    for (let i = 0; i < snake.tail.length - 1; i++) {
      snake.tail[i] = snake.tail[i + 1];
    }
    
    // Add current position to tail
    if (snake.total >= 1) {
      snake.tail[snake.total - 1] = { x: snake.x, y: snake.y };
    }
    
    // Update snake position
    snake.x += snake.xSpeed;
    snake.y += snake.ySpeed;
    
    // Check collision
    if (checkCollision()) {
      handleGameOver();
      return;
    }
    
    // Draw game elements
    drawGame(ctx);
    
    // Check if snake eats food
    if (snake.x === food.x && snake.y === food.y) {
      snake.total++;
      setScore(prevScore => prevScore + 10);
      gameState.food = randomPosition();
      
      // Increase speed slightly every 5 food items
      if (snake.total % 5 === 0) {
        gameState.gameSpeed = Math.max(50, gameState.gameSpeed - 10);
        clearInterval(gameState.gameLoopId);
        const newLoopId = window.setInterval(() => {
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
              updateGame(ctx);
            }
          }
        }, gameState.gameSpeed);
        gameState.gameLoopId = newLoopId;
      }
    }
  };
  
  // Draw game elements
  const drawGame = (ctx: CanvasRenderingContext2D) => {
    const { snake, food } = gameStateRef.current;
    
    // Draw snake body
    ctx.fillStyle = '#0f0';
    for (let i = 0; i < snake.tail.length; i++) {
      ctx.fillRect(snake.tail[i].x, snake.tail[i].y, SCALE, SCALE);
    }
    
    // Draw snake head
    ctx.fillRect(snake.x, snake.y, SCALE, SCALE);
    
    // Draw food
    ctx.fillStyle = '#f00';
    ctx.fillRect(food.x, food.y, SCALE, SCALE);
  };
  
  // Check for collisions
  const checkCollision = (): boolean => {
    const snake = gameStateRef.current.snake;
    
    // Check wall collision
    if (
      snake.x < 0 || 
      snake.x >= GAME_WIDTH || 
      snake.y < 0 || 
      snake.y >= GAME_HEIGHT
    ) {
      return true;
    }
    
    // Check self collision
    for (let i = 0; i < snake.tail.length; i++) {
      if (snake.x === snake.tail[i].x && snake.y === snake.tail[i].y) {
        return true;
      }
    }
    
    return false;
  };
  
  // Handle game over
  const handleGameOver = () => {
    pauseGame();
    setIsGameOver(true);
    
    // Update high score if needed
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeGameHighScore', score.toString());
    }
    
    // Only show toast if it hasn't been shown yet for this game over
    if (!gameStateRef.current.toastShown) {
      toast({
        title: "Game Over!",
        description: `Your score: ${score}. ${score > highScore ? "New High Score!" : ""}`,
      });
      
      // Mark toast as shown
      gameStateRef.current.toastShown = true;
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center mb-2">
        <div className="flex justify-between items-center mb-2">
          <div className="text-left">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-xl font-bold">{score}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">High Score</p>
            <p className="text-xl font-bold">{highScore}</p>
          </div>
        </div>
      </div>
      
      <Card className="overflow-hidden border-2 border-primary">
        <canvas 
          ref={canvasRef} 
          width={GAME_WIDTH} 
          height={GAME_HEIGHT}
          className="bg-background"
        />
      </Card>
      
      <div className="flex flex-col items-center gap-4">
        <Button 
          onClick={togglePause}
          variant="default"
        >
          {isGameOver ? "New Game" : isPaused ? "Start Game" : "Pause Game"}
        </Button>
        
        <div className="controls flex flex-col gap-2">
          <Button 
            variant="outline" 
            className="flex justify-center w-12 h-12 rounded-full"
            onClick={() => changeDirection('Up')}
          >
            <ArrowUp />
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex justify-center w-12 h-12 rounded-full"
              onClick={() => changeDirection('Left')}
            >
              <ArrowLeft />
            </Button>
            <Button 
              variant="outline" 
              className="flex justify-center w-12 h-12 rounded-full"
              onClick={() => changeDirection('Down')}
            >
              <ArrowDown />
            </Button>
            <Button 
              variant="outline" 
              className="flex justify-center w-12 h-12 rounded-full"
              onClick={() => changeDirection('Right')}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
