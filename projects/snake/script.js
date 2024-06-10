const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const menu = document.getElementById('menu');
const startButton = document.getElementById('start-button');
const instructionsButton = document.getElementById('instructions-button');
const creditsButton = document.getElementById('credits-button');

startButton.addEventListener('click', (event) => startGame());

// Set canvas dimensions
canvas.width = 700;
canvas.height = 700;
  
// Show instructions when instructions button is clicked
instructionsButton.addEventListener('click', () => {
alert('Instructions: Use arrow keys to move the snake. Eat the red food to grow. Avoid hitting the walls or yourself.');
});

// Show credits when credits button is clicked
creditsButton.addEventListener('click', () => {
alert('Credits: Made by [Your Name]');
});

// Start game when start button is clicked
function startGame() {
    menu.style.display = 'none';
    canvas.style.display = 'block';
    document.addEventListener('keydown', handleKeyPress);

    // Draw game elements
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'green';
        for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, 10, 10);
        }
        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, 10, 10);
        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`Score: ${score}`, 10, 10);
    }
    
    // Update game state
    function update() {
        // Move snake
        for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
        }
        switch (direction) {
        case 'up':
            snake[0].y -= 10;
            break;
        case 'down':
            snake[0].y += 10;
            break;
        case 'left':
            snake[0].x -= 10;
            break;
        case 'right':
            snake[0].x += 10;
            break;
        }
    
        // Check for collision with food
        if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
        food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
        }
    
        // Check for collision with wall or self
        if (snake[0].x < 0 || snake[0].x >= canvas.width || snake[0].y < 0 || snake[0].y >= canvas.height) {
            resetGame();
            return;
        }
        for (let i = 1; i < snake.length; i++) {
        if (snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            resetGame();
            return;
        }
        }
    }

      // Handle key press events
    function handleKeyPress(e) {
        switch (e.key) {
            case 'ArrowUp':
            direction = 'up';
            break;
            case 'ArrowDown':
            direction = 'down';
            break;
            case 'ArrowLeft':
            direction = 'left';
            break;
            case 'ArrowRight':
            direction = 'right';
            break;
        }
    }

    function resetGame() {
        snake = [
          { x: 200, y: 200 },
          { x: 190, y: 200 },
          { x: 180, y: 200 }
        ];
        food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
        direction = 'right';
        score = 0;
    }


// Set game variables
    let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 }
    ];
    
    let food = { x: Math.floor(Math.random() * 40) * 10, y: Math.floor(Math.random() * 40) * 10 };
    let direction = 'right';
    let score = 0;

    // Game loop
    setInterval(() => {
        update();
        draw();
    }, 100);
}
