import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useInterval } from '../hooks/useInterval';

type Point = { x: number; y: number };

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // Moving up
const BASE_SPEED = 150;

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  // Store the next direction to prevent rapid double-turns killing the snake
  const nextDirection = useRef<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Generate random food position not on the snake
  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    nextDirection.current = INITIAL_DIRECTION;
    setScore(0);
    setIsGameOver(false);
    setFood(generateFood(INITIAL_SNAKE));
    setIsPlaying(true);
  };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Allow WASD and Arrows
      const curr = nextDirection.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (curr.y !== 1) nextDirection.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (curr.y !== -1) nextDirection.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (curr.x !== 1) nextDirection.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (curr.x !== -1) nextDirection.current = { x: 1, y: 0 };
          break;
        default:
          return; // Ignore other keys
      }
      e.preventDefault(); // Prevent scrolling when using arrows
    },
    []
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const moveSnake = useCallback(() => {
    if (isGameOver || !isPlaying) return;

    setSnake((prevSnake) => {
      const currentHead = prevSnake[0];
      const moveDir = nextDirection.current;
      setDirection(moveDir);

      const newHead = {
        x: currentHead.x + moveDir.x,
        y: currentHead.y + moveDir.y,
      };

      // Check wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      // Check self collision
      if (
        prevSnake.some(
          (segment) => segment.x === newHead.x && segment.y === newHead.y
        )
      ) {
        setIsGameOver(true);
        setIsPlaying(false);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        // Don't pop the tail, so it grows
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [food, isGameOver, isPlaying, generateFood]);

  // Use the custom interval hook
  // Speed increases slightly as score goes up
  const speed = Math.max(50, BASE_SPEED - Math.floor(score / 50) * 10);
  useInterval(moveSnake, isPlaying && !isGameOver ? speed : null);

  return (
    <div className="flex flex-col items-center w-full max-w-full">
      {/* Score Header equivalent is not inside game window in HTML, but we keep it here styled identically visually or hide it. HTML shows stats in header, but we retain functionality. */}
      
      <div className="flex justify-between w-full max-w-[400px] mb-4 xl:absolute xl:top-4 xl:-translate-y-full xl:hidden">
         {/* We can hide it if we push score to the App header, but for simplicity, let's keep it here but unstyled like HTML or subtly styled */}
      </div>

      <div className="bg-[#000] flex items-center justify-center relative w-full h-full p-4">
        {/* Game Board (Grid) */}
        <div
          className="grid gap-[2px] border-[4px] border-[#1a1a1a] p-[4px] relative"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 20px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 20px)`,
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            
            const isHead = snake[0].x === x && snake[0].y === y;
            const isBody = snake.some((seg, idx) => idx !== 0 && seg.x === x && seg.y === y);
            const isFood = food.x === x && food.y === y;

            let gridClass = "w-[20px] h-[20px] bg-[#111]";
            if (isHead) {
                gridClass = "w-[20px] h-[20px] bg-neon-cyan z-30 relative shadow-neon-cyan";
            } else if (isBody) {
                gridClass = "w-[20px] h-[20px] bg-neon-cyan opacity-80 z-20 relative";
            } else if (isFood) {
                gridClass = "w-[20px] h-[20px] bg-neon-magenta shadow-neon-magenta z-10 relative animate-pulse";
            }

            return (
              <div
                key={i}
                className={gridClass}
              />
            );
          })}
        </div>

        {/* Overlay screens: Start / Game Over */}
        {(!isPlaying && !isGameOver) && (
          <div className="absolute inset-0 bg-dark-bg/90 flex flex-col items-center justify-center backdrop-blur-sm z-40 border-2 border-neon-cyan">
            <h2 className="text-[32px] text-white tracking-[8px] mb-6 glitch-text" data-text="AWAITING_INPUT">AWAITING_INPUT</h2>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-neon-cyan text-black font-mono uppercase tracking-[2px] transition-none hover:bg-white border-2 border-neon-cyan"
            >
              [ EXECUTE ]
            </button>
          </div>
        )}

        {isGameOver && (
          <div className="absolute inset-0 bg-dark-bg/95 flex flex-col items-center justify-center backdrop-blur-sm z-40 border-4 border-neon-magenta scanlines">
            <div className="absolute inset-0 static-noise z-10"></div>
            <h2 className="text-[28px] text-neon-magenta tracking-[4px] mb-2 glitch-text z-20" data-text="FATAL_EXCEPTION_0x00">FATAL_EXCEPTION_0x00</h2>
            <p className="font-mono text-neon-cyan mb-6 tracking-widest text-[18px] bg-black px-2 z-20">DATA_RECOVERED: {score}</p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-transparent border-2 border-neon-magenta text-neon-magenta font-mono uppercase tracking-[4px] transition-none hover:bg-neon-magenta hover:text-black z-20"
            >
              [ REBOOT ]
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
