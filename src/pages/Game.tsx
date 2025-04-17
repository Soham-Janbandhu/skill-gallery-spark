
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  XCircle, Circle, RefreshCw, Trophy, AlignJustify, Gamepad2, Users
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type Player = "X" | "O" | "tie" | null;
type BoardState = ("X" | "O" | null)[];

const initialBoard: BoardState = Array(9).fill(null);

const Game = () => {
  const [board, setBoard] = useState<BoardState>([...initialBoard]);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Player>(null);
  const [scores, setScores] = useState({ X: 0, O: 0, ties: 0 });
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isComputerOpponent, setIsComputerOpponent] = useState(false);
  const [isComputerThinking, setIsComputerThinking] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);

  // Winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]            // diagonals
  ];

  // Check for winner
  const checkWinner = (boardState: BoardState): Player => {
    for (let combination of winningCombinations) {
      const [a, b, c] = combination;
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        return boardState[a];
      }
    }
    
    // Check for tie
    if (boardState.every(cell => cell !== null)) {
      return "tie";
    }
    
    return null;
  };

  // Computer move
  const computerMove = () => {
    if (!isComputerOpponent || currentPlayer === "X" || winner) return;
    
    setIsComputerThinking(true);
    
    // Simulate thinking time
    setTimeout(() => {
      const availableMoves = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
      
      if (availableMoves.length > 0) {
        // Random move for now, could be improved with minimax algorithm for unbeatable AI
        const randomIndex = Math.floor(Math.random() * availableMoves.length);
        const computerChoice = availableMoves[randomIndex] as number;
        
        handleCellClick(computerChoice);
      }
      
      setIsComputerThinking(false);
    }, 800);
  };

  // Handle cell click
  const handleCellClick = (index: number) => {
    if (winner || board[index] !== null || (isComputerOpponent && currentPlayer === "O") || isComputerThinking) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const gameWinner = checkWinner(newBoard);
    
    if (gameWinner) {
      if (gameWinner === "tie") {
        setScores(prev => ({ ...prev, ties: prev.ties + 1 }));
        toast({
          title: "It's a tie!",
          description: "The game ended in a draw.",
        });
      } else {
        setWinner(gameWinner);
        setScores(prev => ({ 
          ...prev, 
          [gameWinner as "X" | "O"]: prev[gameWinner as "X" | "O"] + 1 
        }));
        toast({
          title: `Player ${gameWinner} wins!`,
          description: `Congratulations! Player ${gameWinner} has won the game.`,
        });
      }
    } else {
      setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
    }
  };

  // Reset game
  const resetGame = () => {
    setBoard([...initialBoard]);
    setCurrentPlayer("X");
    setWinner(null);
  };

  // Start game with selected opponent
  const startGame = (againstComputer: boolean) => {
    setIsComputerOpponent(againstComputer);
    setIsGameStarted(true);
    resetGame();
    
    // Scroll to game board
    if (gameRef.current) {
      gameRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Reset scores
  const resetScores = () => {
    setScores({ X: 0, O: 0, ties: 0 });
    resetGame();
  };

  // Computer's turn
  useEffect(() => {
    if (isComputerOpponent && currentPlayer === "O" && !winner) {
      computerMove();
    }
  }, [currentPlayer, isComputerOpponent, winner]);

  // Cell component
  const Cell = ({ index }: { index: number }) => {
    const value = board[index];
    
    return (
      <button
        className={`aspect-square h-20 w-20 md:h-24 md:w-24 flex items-center justify-center 
                   text-4xl md:text-5xl font-bold rounded-md transition-all 
                   ${value ? 'bg-primary/5 border-2 border-primary/20' : 'hover:bg-muted'}
                   ${(isComputerOpponent && currentPlayer === "O") || winner || isComputerThinking ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        onClick={() => handleCellClick(index)}
        disabled={value !== null || winner !== null || (isComputerOpponent && currentPlayer === "O") || isComputerThinking}
        aria-label={`Cell ${index + 1}`}
      >
        {value === "X" && <XCircle className="h-10 w-10 text-red-500" />}
        {value === "O" && <Circle className="h-10 w-10 text-blue-500" />}
      </button>
    );
  };

  return (
    <div className="pt-20 pb-16">
      {/* Game Header */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Let's Play Tic-Tac-Toe!
            </h1>
            <p className="text-muted-foreground mb-8">
              Take a break and enjoy a quick game. Choose your opponent and make your move!
            </p>
            
            {!isGameStarted && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => startGame(false)} 
                  size="lg" 
                  className="px-8"
                >
                  <Users className="mr-2 h-5 w-5" />
                  Play with Friend
                </Button>
                <Button 
                  onClick={() => startGame(true)} 
                  size="lg" 
                  className="px-8"
                  variant="outline"
                >
                  <Gamepad2 className="mr-2 h-5 w-5" />
                  Play against Computer
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {isGameStarted && (
        <section className="py-10" ref={gameRef}>
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-md mx-auto">
              {/* Game status */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <span className="font-medium mr-2">Current Player:</span>
                  {currentPlayer === "X" ? (
                    <XCircle className="h-6 w-6 text-red-500" />
                  ) : (
                    <Circle className="h-6 w-6 text-blue-500" />
                  )}
                  {isComputerOpponent && currentPlayer === "O" && (
                    <span className="ml-2 text-sm text-muted-foreground">
                      {isComputerThinking ? "(Thinking...)" : "(Computer)"}
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetGame}
                    aria-label="Reset game"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsGameStarted(false)}
                    aria-label="Exit game"
                  >
                    Exit
                  </Button>
                </div>
              </div>
              
              {/* Game board */}
              <Card className="border border-border animate-scale">
                <CardContent className="p-4 md:p-6">
                  <div className="grid grid-cols-3 gap-2 md:gap-4 w-full">
                    {board.map((_, index) => (
                      <Cell key={index} index={index} />
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Scores */}
              <div className="mt-8 grid grid-cols-3 gap-4 animate-fade-in">
                <Card className="border border-border">
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="text-xl font-bold">{scores.X}</div>
                    <div className="text-sm text-muted-foreground">Wins</div>
                  </CardContent>
                </Card>
                
                <Card className="border border-border">
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <AlignJustify className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="text-xl font-bold">{scores.ties}</div>
                    <div className="text-sm text-muted-foreground">Ties</div>
                  </CardContent>
                </Card>
                
                <Card className="border border-border">
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <Circle className="h-8 w-8 text-blue-500" />
                    </div>
                    <div className="text-xl font-bold">{scores.O}</div>
                    <div className="text-sm text-muted-foreground">Wins</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Winner announcement */}
              {winner && (
                <div className="mt-8 text-center animate-scale">
                  <Card className="border border-primary bg-primary/5">
                    <CardContent className="p-6">
                      <Trophy className="h-10 w-10 text-primary mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2">
                        Player {winner} Wins!
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Congratulations on your victory!
                      </p>
                      <Button onClick={resetGame}>
                        Play Again
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Reset scores button */}
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={resetScores}>
                  Reset All Scores
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Game Rules */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-2">
                Game Rules
              </h2>
              <p className="text-muted-foreground">
                In case you need a refresher on how to play Tic-Tac-Toe
              </p>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Objective</h3>
                <p className="text-muted-foreground">
                  The goal is to be the first to form a horizontal, vertical, or diagonal line of three of your symbols (X or O).
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">How to Play</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>The game is played on a 3x3 grid.</li>
                  <li>Player X goes first, followed by player O.</li>
                  <li>Players take turns placing their symbol in an empty cell.</li>
                  <li>The first player to get three of their symbols in a row (horizontally, vertically, or diagonally) wins.</li>
                  <li>If all cells are filled and no player has formed a line of three, the game ends in a tie.</li>
                </ol>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-2">Strategy Tips</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>The center position is strategically valuable.</li>
                  <li>Try to create multiple winning opportunities simultaneously.</li>
                  <li>Block your opponent when they have two in a row.</li>
                  <li>Corners are more valuable than edges in general.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Game;
