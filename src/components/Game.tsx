// src/components/Game.tsx
import React, { useState, useEffect } from "react";

// Tell TypeScript about the global Telegram object.
declare global {
  interface Window {
    Telegram: {
      WebApp: {
        showPopup: (options: {
          title: string;
          message: string;
          buttons: { text: string; type: string }[];
        }) => void;
        sendData: (data: string) => void;
        ready: () => void;
      };
    };
  }
}

const Game: React.FC = () => {
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(10); // 10-second timer
  const [gameActive, setGameActive] = useState<boolean>(false);

  // Effect to handle the countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && gameActive) {
      // End the game when time is up
      setGameActive(false);
      // Show a popup in Telegram with the final score
      window.Telegram.WebApp.showPopup({
        title: "Game Over",
        message: `Your score: ${score}`,
        buttons: [{ text: "OK", type: "default" }],
      });
      // Send the score back to the Telegram bot
      window.Telegram.WebApp.sendData(JSON.stringify({ score }));
    }
    return () => clearTimeout(timer);
  }, [gameActive, timeLeft, score]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(10);
    setGameActive(true);
  };

  const increaseScore = () => {
    if (gameActive) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Click the Button Game</h1>
      <h2>Time Left: {timeLeft}s</h2>
      <h2>Score: {score}</h2>
      {!gameActive ? (
        <button
          onClick={startGame}
          style={{ fontSize: "20px", padding: "10px" }}
        >
          Start Game
        </button>
      ) : (
        <button
          onClick={increaseScore}
          style={{ fontSize: "20px", padding: "10px" }}
        >
          Click Me!
        </button>
      )}
    </div>
  );
};

export default Game;
