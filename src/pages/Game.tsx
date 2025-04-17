
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useFlappyBird } from "@/hooks/useFlappyBird";
import { GamepadIcon, Trophy } from "lucide-react";

const Game = () => {
  const {
    birdPosition,
    pipeHeight,
    pipeX,
    score,
    gameOver,
    highScore,
    isPlaying,
    jump,
    startGame,
  } = useFlappyBird();

  useEffect(() => {
    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      if (!isPlaying) {
        startGame();
      } else {
        jump();
      }
    };

    window.addEventListener('touchstart', handleTouch);
    return () => window.removeEventListener('touchstart', handleTouch);
  }, [isPlaying, jump, startGame]);

  return (
    <div className="pt-20 pb-16">
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Flappy Bird Game
            </h1>
            <p className="text-muted-foreground mb-8">
              Press spacebar or tap the screen to make the bird jump! Avoid the pipes and try to get the highest score.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border border-border overflow-hidden">
              <div 
                className="relative w-full h-[600px] bg-gradient-to-b from-blue-300 to-blue-500 cursor-pointer"
                onClick={!isPlaying ? startGame : jump}
              >
                {/* Bird */}
                <div
                  className="absolute left-[50px] w-[30px] h-[30px] bg-yellow-400 rounded-full transition-transform"
                  style={{
                    top: `${birdPosition}px`,
                    transform: 'rotate(45deg)',
                  }}
                >
                  <div className="absolute top-1 left-1 w-3 h-3 bg-white rounded-full" />
                </div>

                {/* Pipes */}
                <div
                  className="absolute top-0 w-[50px] bg-green-500"
                  style={{
                    left: `${pipeX}px`,
                    height: `${pipeHeight}px`,
                  }}
                />
                <div
                  className="absolute bottom-0 w-[50px] bg-green-500"
                  style={{
                    left: `${pipeX}px`,
                    top: `${pipeHeight + 150}px`,
                  }}
                />

                {/* Score */}
                <div className="absolute top-4 left-0 w-full text-center">
                  <span className="text-4xl font-bold text-white drop-shadow-lg">
                    {score}
                  </span>
                </div>

                {/* Game Over Screen */}
                {gameOver && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Card className="p-8 text-center bg-background/95 backdrop-blur-sm">
                      <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                      <h2 className="text-2xl font-bold mb-2">Game Over!</h2>
                      <p className="text-muted-foreground mb-2">Score: {score}</p>
                      <p className="text-muted-foreground mb-4">High Score: {highScore}</p>
                      <Button onClick={startGame} className="w-full">
                        <GamepadIcon className="mr-2 h-4 w-4" />
                        Play Again
                      </Button>
                    </Card>
                  </div>
                )}

                {/* Start Screen */}
                {!isPlaying && !gameOver && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Card className="p-8 text-center bg-background/95 backdrop-blur-sm">
                      <GamepadIcon className="w-16 h-16 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-4">Ready to Play?</h2>
                      <Button onClick={startGame} className="w-full">
                        Start Game
                      </Button>
                    </Card>
                  </div>
                )}
              </div>
            </Card>

            {/* Game Instructions */}
            <div className="mt-8 text-center">
              <h2 className="text-xl font-semibold mb-4">How to Play</h2>
              <ul className="space-y-2 text-muted-foreground">
                <li>Press spacebar or tap/click to make the bird jump</li>
                <li>Avoid hitting the pipes</li>
                <li>Each pipe passed equals one point</li>
                <li>Try to beat your high score!</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Game;
