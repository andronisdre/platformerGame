// The attributes of the player.
let player = {
    x: 200,
    y: 200,
    x_v: 0,
    y_v: 0,
    jump : true,
    height: 20,
    width: 20
    };

// The status of the arrow keys
let keys = {
    right: false,
    left: false,
    up: false,
    };

let gameOver = false;
let score = 0;
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

// The friction and gravity to show realistic movements    
let gravity = 0.24;
let friction = 0.7;
// The number of platforms
let num = 5;
// The platforms
let platforms = [];
let enemy = [];
// Function to render the canvas
function rendercanvas(){
    ctx.fillStyle = "#F0F8FF";
    ctx.fillRect(0, 0, 1920, 768);
}
// Function to render the player
function renderplayer(){
    ctx.fillStyle = "#008000";
    ctx.fillRect((player.x), (player.y), player.width, player.height);
    }
function renderenemy(){
    ctx.fillStyle = "#FF0000";
    ctx.fillRect((enemy.x), (enemy.y), enemy.width, enemy.height);
}
// Function to create platforms
function createplat(){
    for(i = 0; i < num; i++) {
        platforms.push(
            {
            x: 0,
            y: 140 + (180 * i),
            width: 1920,
            height: 15
            }
        );
        enemy = {
            x: 100 * i,
            y: 200,
            x_v: 0,
            y_v: 0,
            jump : true,
            height: 20,
            width: 20
            };
    }
}
// Function to render platforms
function renderplat(){
    ctx.fillStyle = "#45597E";
    for(i = 0; i < num; i++) {
    ctx.fillRect(platforms[i].x, platforms[i].y, platforms[i].width, platforms[i].height);
    }
}
// This function will be called when a key on the keyboard is pressed
function keydown(e) {
    if (e.key === "a") {
        keys.left = true;
    }
    if (e.key === "d") {
        keys.right = true;
    }
    if ((e.key === "w" || e.key === " ") && !player.jump) {
        // Only allow jumping if not already jumping or falling
        player.jump = true;
        player.y_v = -10;
    }
}

function keyup(e) {
    if (e.key === "a") {
        keys.left = false;
    }
    if (e.key === "d") {
        keys.right = false;
    }
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    clearInterval(setIntervalScoreId);
    alert("Game Over! Press OK ro replay...");
    location.reload();
}

const increaseScore = () => {
score++;
scoreElement.innerHTML = `Score: ${score}`;

highScore = score >= highScore ? score : highScore;
localStorage.setItem("high-score", highScore);

highScoreElement.innerText = `High Score: ${highScore}`;
}

function checkCollision() {
    let collided = false;
    for (let b = 0; b < num; b++) {
        if (platforms[b].x < player.x + player.width &&
            player.x < platforms[b].x + platforms[b].width &&
            platforms[b].y < player.y + player.height &&
            player.y < platforms[b].y + platforms[b].height) {
            // Check if player is moving downwards and if player is above platform
            if (player.y_v >= 0 && player.y + player.height <= platforms[b].y) {
                collided = true;
            } else if (player.y_v < 0 && player.y >= platforms[b].y + platforms[b].height) {
                collided = true;
            } else if (player.y_v > 0 && player.y < platforms[b].y) {
                // Prevent falling through the ground
                player.y = platforms[b].y - player.height;
                player.jump = false;
                player.y_v = 0; // Reset vertical velocity
                collided = true;
            } else if (player.y_v < 0 && player.y + player.height > platforms[b].y + platforms[b].height) {
                // Prevent jumping through platforms from below
                player.y = platforms[b].y + platforms[b].height;
                player.y_v = 0; // Reset vertical velocity
                collided = true;
            }
        }
    }
    return collided; // Return whether collision occurred
}

function loop() {
    if(gameOver) return handleGameOver();
    // If the player is not jumping, apply the effect of friction
    
        player.x_v *= friction;
    
        // If the player is in the air, apply the effect of gravity
        player.y_v += gravity;
    

    // If the left key is pressed, increase the relevant horizontal velocity
    if (keys.left) {
        player.x_v = -2.5;
    }
    if (keys.right) {
        player.x_v = 2.5;
    }

    // Updating the y and x coordinates of the player
    player.y += player.y_v;
    player.x += player.x_v;

    // Check for collisions with platforms
    let collided = checkCollision();
    if (collided) {
        // Player collided with platform, adjust position
        rendercanvas();
        renderplayer();
        renderenemy();
        renderplat();
        return; // Skip rendering and updating if collision occurred
    }

    if (player.y > 1500) {
        gameOver = true;
    }

    // Rendering the canvas, the player, and the platforms
    rendercanvas();
    renderplayer();
    renderenemy();
    renderplat();
}
canvas=document.getElementById("canvas");
ctx=canvas.getContext("2d");
ctx.canvas.height = 768;
ctx.canvas.width = 1920;
createplat();
// Adding the event listeners
document.addEventListener("keydown",keydown);
document.addEventListener("keyup",keyup);
setIntervalId = setInterval(loop,11);
setIntervalScoreId = setInterval(increaseScore,1000);