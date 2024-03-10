import { useEffect, useRef, useState } from "react";

function App() {
  const blockSize = 25;
  const rows = 20;
  const cols = 20;

  const snakeX = useRef(blockSize * 5);
  const snakeY = useRef(blockSize * 5);
  const velocityX = useRef(0);
  const velocityY = useRef(0);
  const snakeBody = useRef<Array<[number, number]>>([]);
  const foodX = useRef(0);
  const foodY = useRef(0);
  const gameOver = useRef(false);
  const [overDisplay, setOverDisplay] = useState(false);
  const [foodCount, setFoodCount] = useState(0); 

  const handlePlayAgain = () => {
    window.location.reload();
  };

  useEffect(() => {
    const board = document.getElementById("board") as HTMLCanvasElement;
    const context = board.getContext("2d") as CanvasRenderingContext2D;

    function placeFood() {
      foodX.current = Math.floor(Math.random() * cols) * blockSize;
      foodY.current = Math.floor(Math.random() * rows) * blockSize;
    }

    function update() {
      if (gameOver.current) {
        return;
      }

      context.fillStyle = "black";
      context.fillRect(0, 0, board.width, board.height);

      context.fillStyle = "red";
      context.fillRect(foodX.current, foodY.current, blockSize, blockSize);

      if (
        snakeX.current === foodX.current &&
        snakeY.current === foodY.current
      ) {
        snakeBody.current.push([foodX.current, foodY.current]);
        placeFood();
        setFoodCount((prevCount) => prevCount + 1);
      }

      const newSnakeBody = [...snakeBody.current];
      for (let i = newSnakeBody.length - 1; i > 0; i--) {
        newSnakeBody[i] = newSnakeBody[i - 1];
      }
      if (newSnakeBody.length) {
        newSnakeBody[0] = [snakeX.current, snakeY.current];
      }
      snakeBody.current = newSnakeBody;

      context.fillStyle = "lime";
      snakeX.current += velocityX.current * blockSize;
      snakeY.current += velocityY.current * blockSize;
      context.fillRect(snakeX.current, snakeY.current, blockSize, blockSize);
      newSnakeBody.forEach(([x, y]) =>
        context.fillRect(x, y, blockSize, blockSize)
      );

      if (
        snakeX.current < 0 ||
        snakeX.current > cols * blockSize ||
        snakeY.current < 0 ||
        snakeY.current > rows * blockSize
      ) {
        gameOver.current = true;
        setOverDisplay(true);
      }

      for (let i = 0; i < newSnakeBody.length; i++) {
        if (
          snakeX.current === newSnakeBody[i][0] &&
          snakeY.current === newSnakeBody[i][1]
        ) {
          gameOver.current = true;
          setOverDisplay(true);
        }
      }
    }

    function changeDirection(e: KeyboardEvent) {
      if (e.code === "ArrowUp" && velocityY.current !== 1) {
        velocityX.current = 0;
        velocityY.current = -1;
      } else if (e.code === "ArrowDown" && velocityY.current !== -1) {
        velocityX.current = 0;
        velocityY.current = 1;
      } else if (e.code === "ArrowLeft" && velocityX.current !== 1) {
        velocityX.current = -1;
        velocityY.current = 0;
      } else if (e.code === "ArrowRight" && velocityX.current !== -1) {
        velocityX.current = 1;
        velocityY.current = 0;
      }
    }

    placeFood();
    document.addEventListener("keyup", changeDirection);
    const intervalId = setInterval(update, 100);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div>
        <h1>Snake</h1>
      </div>
      <div>
        <p>Use arrow keys to move the snake</p>
      </div>
      <div>
        {/* <p>Your snake has {foodCount} squares</p> */}
        <span id="foodCount">{foodCount}</span>
      </div>
      <div>
        <canvas id="board" width={cols * blockSize} height={rows * blockSize} style={{ marginTop: "15px"}}/>
      </div>
      <div id="btn-container">
        <div style={{ display: overDisplay ? "block" : "none" }}>
          <h1>GAME OVER!</h1>
          <div id="btn" onClick={handlePlayAgain}>
            PLAY AGAIN?
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
