import React, { useEffect, useRef, useState } from "react";

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 500;
const SPACESHIP_WIDTH = 40;
const SPACESHIP_HEIGHT = 40;
const MOVE_SPEED = 5;
const GAME_DURATION = 60;

interface FallingObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  type: "obstacle" | "energy";
}

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game states: 'menu' | 'playing' | 'ended'
  const [gameState, setGameState] = useState<"menu" | "playing" | "ended">(
    "menu"
  );
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  // This state is used to display the ship position on re-renders.
  const [shipX, setShipX] = useState(CANVAS_WIDTH / 2 - SPACESHIP_WIDTH / 2);

  // Refs for mutable game data that updates every frame
  const shipXRef = useRef(shipX);
  const fallingObjectsRef = useRef<FallingObject[]>([]);
  // Refs for controlling the loop
  const requestRef = useRef<number>(0);
  const lastTimestampRef = useRef<number>(0);
  const spawnTimerRef = useRef<number>(0);

  // Update shipXRef whenever shipX state changes
  useEffect(() => {
    shipXRef.current = shipX;
  }, [shipX]);

  // Collision check (simple bounding box)
  const isColliding = (
    ax: number,
    ay: number,
    aw: number,
    ah: number,
    bx: number,
    by: number,
    bw: number,
    bh: number
  ): boolean => {
    return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
  };

  // Start or restart the game
  const startGame = () => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setShipX(CANVAS_WIDTH / 2 - SPACESHIP_WIDTH / 2);
    fallingObjectsRef.current = [];
    setGameState("playing");
  };

  // The main game loop runs only when gameState === "playing"
  useEffect(() => {
    if (gameState !== "playing") return;

    // Reset timing refs when starting the game
    lastTimestampRef.current = 0;
    spawnTimerRef.current = 0;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const loop = (timestamp: number) => {
      // Set lastTimestamp on the very first frame
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaSec = (timestamp - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = timestamp;

      // 1. Update Timer
      setTimeLeft((prevTime) => {
        const newTime = prevTime - deltaSec;
        if (newTime <= 0) {
          setGameState("ended");
          return 0;
        }
        return newTime;
      });

      // 2. Spawn falling objects every ~1.5 seconds
      spawnTimerRef.current += deltaSec;
      if (spawnTimerRef.current > 1.5) {
        spawnTimerRef.current = 0;
        const r = Math.random();
        const newObj: FallingObject = {
          x: Math.random() * (CANVAS_WIDTH - 30),
          y: -30,
          width: 30,
          height: 30,
          speed: 50 + Math.random() * 40, // 50 to 90 px/s
          type: r < 0.5 ? "obstacle" : "energy",
        };
        fallingObjectsRef.current.push(newObj);
      }

      // 3. Update falling objects and check for collisions
      fallingObjectsRef.current = fallingObjectsRef.current.filter((obj) => {
        // Move object downward
        obj.y += obj.speed * deltaSec;
        // Check collision with the spaceship
        if (
          isColliding(
            shipXRef.current,
            CANVAS_HEIGHT - SPACESHIP_HEIGHT - 10,
            SPACESHIP_WIDTH,
            SPACESHIP_HEIGHT,
            obj.x,
            obj.y,
            obj.width,
            obj.height
          )
        ) {
          // Adjust score based on object type
          if (obj.type === "obstacle") {
            setScore((s) => s - 1);
          } else {
            setScore((s) => s + 1);
          }
          return false; // Remove the object on collision
        }
        // Remove object if it moves off screen
        return obj.y <= CANVAS_HEIGHT;
      });

      // 4. Drawing
      context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw falling objects from the ref
      fallingObjectsRef.current.forEach((obj) => {
        context.fillStyle = obj.type === "obstacle" ? "red" : "green";
        context.fillRect(obj.x, obj.y, obj.width, obj.height);
      });

      // Draw the spaceship using the current shipX value from the ref
      context.fillStyle = "blue";
      context.fillRect(
        shipXRef.current,
        CANVAS_HEIGHT - SPACESHIP_HEIGHT - 10,
        SPACESHIP_WIDTH,
        SPACESHIP_HEIGHT
      );

      // Continue the loop if the game is still playing
      if (gameState === "playing") {
        requestRef.current = requestAnimationFrame(loop);
      }
    };

    // Start the loop
    requestRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  // --- Input Handlers ---
  const handleKeyDown = (e: React.KeyboardEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing") return;
    if (e.key === "ArrowLeft") {
      setShipX((prev) => Math.max(prev - MOVE_SPEED, 0));
    } else if (e.key === "ArrowRight") {
      setShipX((prev) =>
        Math.min(prev + MOVE_SPEED, CANVAS_WIDTH - SPACESHIP_WIDTH)
      );
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const handleMouseDown = () => {
    if (gameState === "playing") setIsDragging(true);
  };
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing" || !isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    let newX = mouseX - SPACESHIP_WIDTH / 2;
    newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - SPACESHIP_WIDTH));
    setShipX(newX);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const touchX = e.touches[0].clientX - rect.left;
    let newX = touchX - SPACESHIP_WIDTH / 2;
    newX = Math.max(0, Math.min(newX, CANVAS_WIDTH - SPACESHIP_WIDTH));
    setShipX(newX);
  };

  const displayTime = Math.ceil(timeLeft);

  return (
    <div
      style={{ position: "relative", width: CANVAS_WIDTH, margin: "0 auto" }}
    >
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        tabIndex={0}
        style={{
          border: "1px solid #ccc",
          backgroundColor: "#000",
          display: "block",
          margin: "0 auto",
        }}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      />

      {/* Overlay UI */}
      {gameState === "menu" && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "white",
          }}
        >
          <h2>Spaceship Game</h2>
          <button onClick={startGame}>Start</button>
        </div>
      )}

      {gameState === "playing" && (
        <div
          style={{
            position: "absolute",
            top: 5,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "yellow",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          Time Left: {displayTime}s | Score: {score}
        </div>
      )}

      {gameState === "ended" && (
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: 0,
            right: 0,
            textAlign: "center",
            color: "white",
          }}
        >
          <h2>Game Over!</h2>
          <p>Your Score: {score}</p>
          <button onClick={startGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default GameCanvas;
