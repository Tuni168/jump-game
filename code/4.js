const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const levelDisplay = document.getElementById("levelDisplay");

canvas.width = 800;
canvas.height = 400;

let isGameRunning = false;
let level = 1;
let score = 0;

// Player Object
let player = {
    x: 50,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    color: "red",
    velocityY: 0,
    gravity: 1.5,
    isJumping: false
};

// Obstacle Object
let obstacle = {
    x: canvas.width,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    color: "blue",
    speed: 5
};

// Jump Control
window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !player.isJumping) {
        player.velocityY = -20;
        player.isJumping = true;
    }
});

// Start Game
startBtn.addEventListener("click", () => {
    if (!isGameRunning) {
        isGameRunning = true;
        startBtn.disabled = true;
        resetBtn.disabled = false;
        gameLoop();
    }
});

// Reset Game
resetBtn.addEventListener("click", () => {
    isGameRunning = false; 
    startBtn.disabled = false; 
    resetBtn.disabled = true; 

    // Reset Game Variables
    level = 1;
    score = 0;
    levelDisplay.textContent = `Level: ${level}`;

    // Reset Player
    player.y = canvas.height - 50;
    player.velocityY = 0;
    player.isJumping = false;

    // Reset Obstacle
    obstacle.x = canvas.width;
    obstacle.speed = 5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Game Update Function
function update() {
    if (!isGameRunning) return;

    // Apply Gravity
    player.y += player.velocityY;
    player.velocityY += player.gravity;

    // Prevent Player from Falling Below Ground
    if (player.y >= canvas.height - player.height) {
        player.y = canvas.height - player.height;
        player.isJumping = false;
    }

    // Move Obstacle
    obstacle.x -= obstacle.speed;
    if (obstacle.x < -obstacle.width) {
        obstacle.x = canvas.width; // Reset obstacle
        score++;

        // Increase difficulty after every 5 points
        if (score % 5 === 0) {
            level++;
            obstacle.speed += 2; // Increase speed
            levelDisplay.textContent = `Level: ${level}`;
        }
    }

    // Collision Detection
    if (
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    ) {
        alert(`Game Over! You reached Level ${level}.`);
        isGameRunning = false;
        startBtn.disabled = false;
        resetBtn.disabled = true;
    }

    // Win Condition (if level reaches 10)
    if (level > 10) {
        alert("Congratulations! You have completed all levels.");
        isGameRunning = false;
        startBtn.disabled = false;
        resetBtn.disabled = true;
    }
}

// Draw Function
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.fillStyle = "#555";
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);

    // Draw Player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw Obstacle
    ctx.fillStyle = obstacle.color;
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
}

// Game Loop
function gameLoop() {
    update();
    draw();
    if (isGameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

