import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Trophy, ArrowUp, ArrowDown, ExternalLink, Gamepad2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SnakeGame from "@/components/games/SnakeGame";

// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 300;
const GROUND_HEIGHT = 20;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const OBSTACLE_SPEED = 6;
const OBSTACLE_INTERVAL_MIN = 800;
const OBSTACLE_INTERVAL_MAX = 2000;

const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(true);
  const [activeGame, setActiveGame] = useState<"mario" | "snake">("snake");
  const [showExternalGame, setShowExternalGame] = useState(false);
  const isMobile = useIsMobile();
  
  // Game state refs (using refs to avoid re-renders during gameplay)
  const gameStateRef = useRef({
    animationFrameId: 0,
    lastObstacleTime: 0,
    nextObstacleInterval: 0,
    obstacles: [] as Array<{x: number, width: number, height: number}>,
    
    // Mario state
    mario: {
      x: 50,
      y: 0,
      width: 44,
      height: 52,
      velocityY: 0,
      isJumping: false,
      frameX: 0,
      frameCount: 0,
      animationSpeed: 5,
    },
    
    // Chasing dino state (purely visual)
    chasingDino: {
      x: -30,
      width: 44,
      height: 48,
      frameX: 0,
      frameCount: 0,
      animationSpeed: 6,
    },
    
    // Game speed & scoring
    gameSpeed: 1,
    frameCount: 0,
    lastScoreUpdateTime: 0
  });
  
  // Game assets
  const assetsRef = useRef({
    mario: new Image(),
    cactus: new Image(),
    ground: new Image(),
    cloud: new Image(),
    chasingDino: new Image(),
    loaded: false,
    loadCount: 0,
    totalAssets: 5
  });

  // Load game assets
  useEffect(() => {
    const assets = assetsRef.current;
    
    const onLoad = () => {
      assets.loadCount++;
      if (assets.loadCount === assets.totalAssets) {
        assets.loaded = true;
      }
    };
    
    // Load Mario sprite
    assets.mario.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAVgAAAA0CAYAAADYn3jKAAAACXBIWXMAAAsTAAALEwEAmpwYAAAF8WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDQtMzBUMTA6MjI6MzIrMDU6MzAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTA0LTMwVDEwOjI0OjMzKzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTA0LTMwVDEwOjI0OjMzKzA1OjMwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmEwNTNhMGI2LTAw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";
    assets.mario.onload = onLoad;
    
    // Load cactus sprite
    assets.cactus.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAACXBIWXMAAAsTAAALEwEAmpwYAAAByElEQVR4nO2Uv0vDQBTHvykt2MFBcHByFCe3Dv4BbkJnR+kmOLiIi4OTk1MH/wPp4uTgH+AkIjjooA6Kg5ODUHwfNJFrrhcvl6a2dPELj9x73/f9vLt3ByhRYrW0VfKn9FzHnQOEfQBVMPnf9Ao5Aoh7rtOezsEDD7wJAWdDNmLseeBdcHFYsn5jGHTQ6GW5b8euj+v1NoXG0AJvcwT5JiArjtOgSheZ9igtAyK+SoO6A/krnrA8f6A8Z2HhdGAWqaxB1i3zRDSXATdek/jn3qppN8amw7QkqDAC2kLIKpTvWtahyeMLCNJic9MbXibUgIt9YdaXFZLtiLnZycJA5f5mICuHPPBO8slkTQO13R0zzgSZpxJQWRdNk4ezfYi4Yr3Xnm6Qnlc1uw8B10U0APkUeN4BWHgAvlOmOmQhNeC+hyA4oUrgY3rsv5GNMKkgfbjU4yInpgmHjuvsh5E/Mh7pncYxQIdxdXniOq1pou9/FfqJmVfagXEEVqJEieX4AXE4ruIvYkDiAAAAAElFTkSuQmCC";
    assets.cactus.onload = onLoad;
    
    // Load ground sprite
    assets.ground.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAAgCAYAAADaInAlAAAACXBIWXMAAAsTAAALEwEAmpwYAAABcUlEQVR4nO2ZTUoDMRTH/5lWoeAVvIBQ9QBewtm0G8W9UHShC0FcCaV05QV0pyvduld34kLUE6gHaDduhJlXmEKnk5lJ8zGT+UGgIXl5/8l7eUkG8Hg8VaARWWs6DqiHOOznLg1LTFtNR2NICBgjTI/GvJwKQiHvgSMFmPNm86FzvdYicWf/0LrIhYF/2kJc5UO1hsr1+cV5PXxbZ4CwI1NnXWCS9B6PI1G6UAb4q8neTQf3N7ffn3lP+xIkcZXFnYe7ysFOsz+/i1lxIkLgadsjgCXlhcXNA/GU1jHzK85U+PLbRltKIWZcyiCsnajR9nfNMkKKR2IsTffJV8bkOJfMkd7RXfGUHmgmfBEpRuii9vzIwnFzaa+eOmYLIcQvqNr8NE7BPJ9atmBXtFNkIiQXr2iPCFMqnG/uWxvnpLKdOA5d0RXkikbNWuOIpHnNdOSKUm/uUCuH+s+4BfOckQR9EPbT18w1GAy2AIMRAG0QNZWnbsjodTI5Aww+BdgZ2yFEsDtIAewmx6JA7GAbo4DYHQPgaDF7GNIP18V0ML+lzqzOxKjr+UPOXNGzmN6PkGF/gWxSU4yCI58vjwV8Aw6HL48kx2MJAAAAAElFTkSuQmCC";
    assets.ground.onload = onLoad;
    
    // Load cloud sprite
    assets.cloud.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABcUlEQVR4nO2ZTUoDMRTH/5lWoeAVvIBQ9QBewtm0G8W9UHShC0FcCaV05QV0pyvduld34kLUE6gHaDduhJlXmEKnk5lJ8zGT+UGgIXl5/8l7eUkG8Hg8VaARWWs6DqiHOOznLg1LTFtNR2NICBgjTI/GvJwKQiHvgSMFmPNm86FzvdYicWf/0LrIhYF/2kJc5UO1hsr1+cV5PXxbZ4CwI1NnXWCS9B6PI1G6UAb4q8neTQf3N7ffn3lP+xIkcZXFnYe7ysFOsz+/i1lxIkLgadsjgCXlhcXNA/GU1jHzK85U+PLbRltKIWZcyiCsnajR9nfNMkKKR2IsTffJV8bkOJfMkd7RXfGUHmgmfBEpRuii9vzIwnFzaa+eOmYLIcQvqNr8NE7BPJ9atmBXtFNkIiQXr2iPCFMqnG/uWxvnpLKdOA5d0RXkikbNWuOIpHnNdOSKUm/uUCuH+s+4BfOckQR9EPbT18w1GAy2AIMRAG0QNZWnbsjodTI5Aww+BdgZ2yFEsDtIAewmx6JA7GAbo4DYHQPgaDF7GNIP18V0ML+lzqzOxKjr+UPOXNGzmN6PkGF/gWxSU4yCI58vjwV8Aw6HL48kx2MJAAAAAElFTkSuQmCC";
    assets.cloud.onload = onLoad;
    
    // Load chasing dino sprite
    assets.chasingDino.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFgAAAAwCAYAAACVMb01AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFvmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjQtMDQtMzBUMTA6NTU6MjArMDU6MzAiIHhtcDpNb2RpZnlEYXRlPSIyMDI0LTA0LTMwVDEwOjU2OjMzKzA1OjMwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDI0LTA0LTMwVDEwOjU2OjMzKzA1OjMwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjdlZDA4YTQ2LWYwM2QtNGVjNi04ZTM1LTk5Y2MxZDIzZTQ0ZiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDphMDUzYTBiNi0wMGZkLTRkYTEtOTMxNC0xYzMwNDA3OTQyZTUiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphMDUzYTBiNi0wMGZkLTRkYTEtOTMxNC0xYzMwNDA3OTQyZTUiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjdlZDA4YTQ2LWYwM2QtNGVjNi04ZTM1LTk5Y2MxZDIzZTQ0ZiIgc3RFdnQ6d2hlbj0iMjAyNC0wNC0zMFQxMDo1NToyMCswNTozMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKE1hY2ludG9zaCkiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ABz7NAAAAqhJREFUaN7tmU1IVFEUx3/zjZqkjiNiVAtdJC2iL7DCiKJNEBG0MIpEXUVUi4SgVREUpLWM2tWiDxeCBEEURUVY0aIvoqJNEQVlRR/YoDXjvHmncRrvnfPeHWfGOz+4y/n/7zn//96Zd+cZUVUmGOac2V77aoay1zJf8TlV3QQcsyScB3bZ7nErsBF47pvXxz7bPZG4LpRGprkYVp1cQmQEWJOwaQxYCdwOWH8FWArUWHz05q4Gkt7cO4HVwI1KjlQpBwn2Z2jbGrLaB+Rj5nXmbgPOWHPpzZ0Ejjixx+MaFMeBlCZZL7lVb+6tWo7qVXBNnbDFpOmqpkMiEhFhL7Ap7sFwGLgJLAKqgdjJTGARcKMMJzFwCVgA1HoZGJXdJ7YDXcCxqP1FaR5we4JcOtEA9AJ7gE4nZklmDHA/zSf9ZRnAYGzNhF3A3jIMBg7gF9V1dOqiSprLMIBs5nm1nXTqohy6nMBR5q+yBLMq8tOVmO8bkptVKn9Ao1BUwWlLML+TfSj613OVC6nRGXMAr6WCa9KPXs11wOOQ3EeBh8CcFF7Q8/NOLKrglqIHc3HC3BvANKA/JHcdcBroS/EFvcWJ5V3V5zjH8FSCpzng4Ulgyyg8a7KOVNVdVS0Aa73Lm18DJitJyV3kxEKP4IKq7gduAfOBw8AMb265qtYCpRSedTt11nsN9+/JPVw/qqqD3t/HVTXdnOxiHr1hjsuJqp5Q1T5TjK2XpQBMBUYteQvGpfR08Fz6O/W6iCWWvMMicto3Pl3h5y0OOmgPAk8DJqbbPmFibNqHM/NA6VTAKPAA6Af+Bd36BcAvYLPlxAfYZ7lp1nuckpjuAtdS1OyQJVcOaPbqnvZq0JnQ+tFXg0FV7QnxMKKqPal9B/5vJiYmUol/Cz2UsTc9y04AAAAASUVORK5CYII=";
    assets.chasingDino.onload = onLoad;

    // Initialize game loop once assets are loaded
    const checkAssetsInterval = setInterval(() => {
      if (assets.loaded) {
        clearInterval(checkAssetsInterval);
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            drawInitialScreen(ctx);
          }
        }
      }
    }, 100);

    return () => {
      clearInterval(checkAssetsInterval);
      if (gameStateRef.current.animationFrameId) {
        cancelAnimationFrame(gameStateRef.current.animationFrameId);
      }
    };
  }, []);
  
  // Draw the initial welcome screen
  const drawInitialScreen = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate ground position
    const groundY = canvas.height - GROUND_HEIGHT;
    
    // Draw ground
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(0, groundY, canvas.width, GROUND_HEIGHT);
    
    // Draw header
    ctx.fillStyle = "#333";
    ctx.font = "24px 'Arial'";
    ctx.textAlign = "center";
    ctx.fillText("Mario Runner Game", canvas.width / 2, canvas.height / 3);
    
    // Draw instruction
    if (!isPlaying) {
      ctx.font = "16px 'Arial'";
      ctx.fillText("Press Space or Click/Tap to Start", canvas.width / 2, canvas.height / 2);
    }
    
    // Draw Mario
    if (assetsRef.current.loaded) {
      const mario = gameStateRef.current.mario;
      ctx.drawImage(
        assetsRef.current.mario,
        0, // Source x
        0, // Source y
        44, // Source width
        52, // Source height
        mario.x, // Destination x
        groundY - mario.height, // Destination y
        mario.width, // Destination width
        mario.height // Destination height
      );
    }
  };

  // Start the game
  const startGame = () => {
    if (isPlaying || !assetsRef.current.loaded) return;
    
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    setIsInstructionsOpen(false);
    
    // Reset game state
    const gameState = gameStateRef.current;
    gameState.obstacles = [];
    gameState.lastObstacleTime = 0;
    gameState.nextObstacleInterval = Math.floor(
      Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN
    );
    gameState.mario.velocityY = 0;
    gameState.mario.isJumping = false;
    gameState.mario.y = 0;
    gameState.frameCount = 0;
    gameState.gameSpeed = 1;
    gameState.lastScoreUpdateTime = Date.now();
    gameState.chasingDino.x = -30;
    
    // Start game loop
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        gameLoop(ctx);
      }
    }
  };
  
  // Game loop
  const gameLoop = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    const gameState = gameStateRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Calculate ground position
    const groundY = canvas.height - GROUND_HEIGHT;
    
    // Update game speed over time
    if (gameState.frameCount % 1000 === 0) {
      gameState.gameSpeed += 0.1;
    }
    
    // Update score
    const currentTime = Date.now();
    if (currentTime - gameState.lastScoreUpdateTime >= 100) {
      setScore(prevScore => prevScore + 1);
      gameState.lastScoreUpdateTime = currentTime;
    }
    
    // Update Mario
    updateMario(groundY);
    
    // Update chasing dinosaur
    updateChasingDino(groundY);
    
    // Update and add obstacles
    updateObstacles(canvas.width, groundY);
    
    // Check collisions
    checkCollisions(groundY);
    
    // Draw game elements
    drawGameElements(ctx, groundY);
    
    // Increment frame count
    gameState.frameCount++;
    
    // Continue game loop
    if (!gameOver) {
      gameState.animationFrameId = requestAnimationFrame(() => gameLoop(ctx));
    } else {
      // Game over actions
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('marioRunnerHighScore', score.toString());
      }
      
      // Draw game over text
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = "#fff";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, canvas.height / 3);
      ctx.font = "18px Arial";
      ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 - 20);
      ctx.fillText(`High Score: ${Math.max(score, highScore)}`, canvas.width / 2, canvas.height / 2 + 10);
      ctx.font = "16px Arial";
      ctx.fillText("Press Space or Click/Tap to Restart", canvas.width / 2, canvas.height / 2 + 50);
    }
  };
  
  // Update Mario's position and state
  const updateMario = (groundY: number) => {
    const mario = gameStateRef.current.mario;
    
    // Apply gravity if jumping
    if (mario.isJumping) {
      mario.velocityY += GRAVITY;
      mario.y += mario.velocityY;
      
      // Check if Mario landed
      if (mario.y + mario.height >= groundY) {
        mario.y = 0; // Reset y position relative to ground
        mario.isJumping = false;
        mario.velocityY = 0;
      }
    }
    
    // Update animation frame
    if (gameStateRef.current.frameCount % mario.animationSpeed === 0) {
      mario.frameX = (mario.frameX === 0) ? 44 : 0;
    }
  };
  
  // Update chasing dinosaur
  const updateChasingDino = (groundY: number) => {
    const dino = gameStateRef.current.chasingDino;
    
    // Gradually move dinosaur into view from the left
    if (dino.x < 20) {
      dino.x += 0.2;
    }
    
    // Update animation frame
    if (gameStateRef.current.frameCount % dino.animationSpeed === 0) {
      dino.frameX = (dino.frameX === 0) ? 44 : 0;
    }
  };
  
  // Update obstacles
  const updateObstacles = (canvasWidth: number, groundY: number) => {
    const gameState = gameStateRef.current;
    const currentTime = Date.now();
    
    // Add new obstacle
    if (currentTime - gameState.lastObstacleTime > gameState.nextObstacleInterval) {
      // Add new cactus
      const cactusHeight = 30 + Math.random() * 20;
      gameState.obstacles.push({
        x: canvasWidth,
        width: 20,
        height: cactusHeight
      });
      
      gameState.lastObstacleTime = currentTime;
      gameState.nextObstacleInterval = Math.floor(
        Math.random() * (OBSTACLE_INTERVAL_MAX - OBSTACLE_INTERVAL_MIN) + OBSTACLE_INTERVAL_MIN
      ) / gameState.gameSpeed;
    }
    
    // Move obstacles
    for (let i = 0; i < gameState.obstacles.length; i++) {
      gameState.obstacles[i].x -= OBSTACLE_SPEED * gameState.gameSpeed;
      
      // Remove obstacles that are off-screen
      if (gameState.obstacles[i].x + gameState.obstacles[i].width < 0) {
        gameState.obstacles.splice(i, 1);
        i--;
      }
    }
  };
  
  // Check collisions
  const checkCollisions = (groundY: number) => {
    const mario = gameStateRef.current.mario;
    const obstacles = gameStateRef.current.obstacles;
    
    // Mario's hitbox (slightly smaller than visual size)
    const marioHitbox = {
      x: mario.x + 5,
      y: groundY - mario.height + mario.y + 5,
      width: mario.width - 10,
      height: mario.height - 10
    };
    
    for (let obstacle of obstacles) {
      // Obstacle hitbox
      const obstacleHitbox = {
        x: obstacle.x,
        y: groundY - obstacle.height,
        width: obstacle.width,
        height: obstacle.height
      };
      
      // Check collision
      if (
        marioHitbox.x < obstacleHitbox.x + obstacleHitbox.width &&
        marioHitbox.x + marioHitbox.width > obstacleHitbox.x &&
        marioHitbox.y < obstacleHitbox.y + obstacleHitbox.height &&
        marioHitbox.y + marioHitbox.height > obstacleHitbox.y
      ) {
        // Collision detected
        setGameOver(true);
        setIsPlaying(false);
        
        toast({
          title: "Game Over!",
          description: `You scored ${score} points.`,
        });
      }
    }
  };
  
  // Draw game elements
  const drawGameElements = (ctx: CanvasRenderingContext2D, groundY: number) => {
    const canvas = ctx.canvas;
    const gameState = gameStateRef.current;
    const assets = assetsRef.current;
    
    // Draw ground
    for (let i = 0; i < canvas.width; i += assets.ground.width) {
      ctx.drawImage(assets.ground, i, groundY);
    }
    
    // Draw clouds (purely decorative)
    ctx.drawImage(assets.cloud, canvas.width * 0.3, groundY - 100, 60, 30);
    ctx.drawImage(assets.cloud, canvas.width * 0.7, groundY - 80, 40, 20);
    
    // Draw obstacles
    for (const obstacle of gameState.obstacles) {
      ctx.drawImage(
        assets.cactus,
        obstacle.x,
        groundY - obstacle.height,
        obstacle.width,
        obstacle.height
      );
    }
    
    // Draw chasing dinosaur
    const dino = gameState.chasingDino;
    ctx.drawImage(
      assets.chasingDino,
      dino.frameX, 0, 44, 48,
      dino.x, groundY - dino.height, dino.width, dino.height
    );
    
    // Draw Mario
    const mario = gameState.mario;
    ctx.drawImage(
      assets.mario,
      mario.frameX, 0, 44, 52,
      mario.x, groundY - mario.height + mario.y, mario.width, mario.height
    );
    
    // Draw score
    ctx.fillStyle = "#333";
    ctx.font = "16px 'Arial'";
    ctx.textAlign = "left";
    ctx.fillText(`Score: ${score}`, 20, 30);
    ctx.fillText(`High Score: ${Math.max(highScore, score)}`, 20, 50);
  };
  
  // Handle jump
  const handleJump = () => {
    if (!isPlaying) {
      // Start game if not playing
      startGame();
    } else if (!gameOver) {
      // Jump if game is active
      const mario = gameStateRef.current.mario;
      if (!mario.isJumping) {
        mario.isJumping = true;
        mario.velocityY = JUMP_FORCE;
      }
    } else {
      // Restart game if game over
      startGame();
    }
  };
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " " || e.key === "ArrowUp") {
        e.preventDefault();
        handleJump();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlaying, gameOver]);
  
  // Load high score from local storage
  useEffect(() => {
    const savedHighScore = localStorage.getItem("marioRunnerHighScore");
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);
  
  // Toggle external game display
  const toggleExternalGame = () => {
    setShowExternalGame(!showExternalGame);
    if (!showExternalGame) {
      toast({
        title: "External Game Loaded",
        description: "Now showing the reference Mario runner game.",
      });
    }
  };

  return (
    <div className="container py-8 mt-16 min-h-screen">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-4xl">
          {/* Game Header */}
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Arcade Games</h1>
            <p className="text-muted-foreground">
              Play classic arcade games right in your browser!
            </p>
          </div>

          {/* Game Selector */}
          <Tabs 
            defaultValue="snake" 
            className="mb-6"
            onValueChange={(value) => setActiveGame(value as "mario" | "snake")}
          >
            <div className="flex justify-center mb-4">
              <TabsList>
                <TabsTrigger value="mario" className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4" /> Mario Runner
                </TabsTrigger>
                <TabsTrigger value="snake" className="flex items-center gap-2">
                  <Gamepad2 className="h-4 w-4" /> Snake Game
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Mario Game */}
            <TabsContent value="mario">
              {/* Game Container */}
              <div className="relative mb-6">
                {showExternalGame ? (
                  <div className="w-full h-[400px] relative border border-border rounded-md overflow-hidden">
                    <iframe 
                      src="https://chromedino.com/mario/" 
                      frameBorder="0" 
                      scrolling="no" 
                      width="100%" 
                      height="100%" 
                      loading="lazy"
                      className="absolute w-full h-full z-10"
                    ></iframe>
                  </div>
                ) : (
                  <Card className="overflow-hidden w-full">
                    <CardContent className="p-0 relative">
                      <canvas
                        ref={canvasRef}
                        width={GAME_WIDTH}
                        height={GAME_HEIGHT}
                        className="w-full h-auto bg-background cursor-pointer"
                        onClick={handleJump}
                        onTouchStart={handleJump}
                      />
                      
                      {/* Mobile Controls */}
                      {isMobile && isPlaying && !gameOver && (
                        <div className="absolute bottom-4 right-4 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={handleJump}
                            className="bg-primary/30 backdrop-blur-sm"
                          >
                            <ArrowUp className="h-6 w-6" />
                          </Button>
                        </div>
                      )}
                      
                      {/* Instruction overlay */}
                      {isInstructionsOpen && !isPlaying && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center p-6">
                          <div className="max-w-md text-center">
                            <h3 className="text-xl font-bold mb-4">How to Play</h3>
                            <ul className="text-left space-y-2 mb-4">
                              <li>• Press <strong>Space</strong> or <strong>Click/Tap</strong> to start the game</li>
                              <li>• Press <strong>Space</strong> or <strong>Up Arrow</strong> or <strong>Tap</strong> to jump</li>
                              <li>• Avoid obstacles to score points</li>
                              <li>• Game speeds up as you progress</li>
                            </ul>
                            <Button onClick={() => setIsInstructionsOpen(false)}>
                              Got it!
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Game Controls */}
              <div className="flex flex-wrap gap-3 justify-center mb-6">
                <Button variant="outline" onClick={() => setIsInstructionsOpen(true)}>
                  How to Play
                </Button>
                <Button onClick={handleJump} disabled={isPlaying && !gameOver}>
                  {!isPlaying ? "Start Game" : gameOver ? "Play Again" : "Playing..."}
                </Button>
                <Button variant="outline" onClick={toggleExternalGame}>
                  {showExternalGame ? "Show Local Game" : "Show Reference Game"}
                </Button>
              </div>
              
              {/* High Scores */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                    <h3 className="text-lg font-semibold">High Scores</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Score</p>
                      <p className="text-2xl font-bold">{score}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">High Score</p>
                      <p className="text-2xl font-bold">{highScore}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Snake Game */}
            <TabsContent value="snake">
              <SnakeGame />
            </TabsContent>
          </Tabs>
          
          {/* About Section */}
          <div className="mt-6 text-sm text-muted-foreground">
            <p>
              These games are inspired by classic arcade games. The Mario Runner is inspired by Google Chrome's T-Rex game.
              The original game can be found at <a href="https://chromedino.com/" target="_blank" rel="noreferrer" className="text-primary inline-flex items-center">
                chromedino.com <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
