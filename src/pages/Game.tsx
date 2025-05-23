
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, ExternalLink, Gamepad2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import SnakeGame from "@/components/games/SnakeGame";

const Game = () => {
  const [showExternalGame, setShowExternalGame] = useState(false);
  
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
            <h1 className="text-3xl font-bold mb-2">Snake Game</h1>
            <p className="text-muted-foreground">
              Play classic snake game right in your browser!
            </p>
          </div>

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
              <SnakeGame />
            )}
          </div>
          
          {/* Game Controls */}
          <div className="flex flex-wrap gap-3 justify-center mb-6">
            <Button 
              variant="outline" 
              onClick={toggleExternalGame}
              className="flex items-center gap-2"
            >
              <Gamepad2 className="h-4 w-4" />
              {showExternalGame ? "Show Snake Game" : "Show Reference Game"}
            </Button>
          </div>
          
          {/* About Section */}
          <div className="mt-6 text-sm text-muted-foreground">
            <p>
              This game is inspired by the classic Snake game. You can also check out the Mario Runner game at <a href="https://chromedino.com/" target="_blank" rel="noreferrer" className="text-primary inline-flex items-center">
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
