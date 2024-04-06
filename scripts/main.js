// main.js

// Import functions from other modules
import { generateCoins } from './coins.js'; // Import generateCoins (includes coins and checkCoinCollision)

// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Initialize player variables
let x = canvas.width / 2 - 25; // Player's initial x position
let y = canvas.height / 2 - 25; // Player's initial y position
let vxr = 0; // Horizontal velocity (right)
let vxl = 0; // Horizontal velocity (left)
let vy = 0; // Vertical velocity
const playerSize = 50; // Size of the player

// Initialize score
let score = 0;

// Function to initialize the game
function initializeGame() {
    // Display start message inside the canvas container
    const gameMessage = document.getElementById('gameMessage');
    gameMessage.style.display = 'block';

    // Add event listener to start the game on space bar press
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space') {
            // Hide the start message
            gameMessage.style.display = 'none';

            // Call generateCoins to initialize coins and checkCoinCollision
            const { coins, checkCoinCollision } = generateCoins(canvas, ctx);

            // Start the game loop
            updateGame(coins, checkCoinCollision);
        }
    });

    // Event listeners for player movement
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

// Event handler for key down events (player movement)
function handleKeyDown(e) {
    if (e.code === 'KeyD') vxr = 5; // Move right
    if (e.code === 'KeyA') vxl = -5; // Move left
    if (e.code === 'KeyW') vy = -5; // Move up
    if (e.code === 'KeyS') vy = 5; // Move down
}

// Event handler for key up events (stop player movement)
function handleKeyUp(e) {
    if (e.code === 'KeyD') vxr = 0; // Stop moving right
    if (e.code === 'KeyA') vxl = 0; // Stop moving left
    if (e.code === 'KeyW') vy = 0; // Stop moving up
    if (e.code === 'KeyS') vy = 0; // Stop moving down
}

// Function to update the game state
function updateGame(coins, checkCoinCollision) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update player position based on velocity
    x += vxr + vxl;
    y += vy;

    // Keep player within canvas boundaries
    if (x < 0) x = 0;
    if (x + playerSize > canvas.width) x = canvas.width - playerSize;
    if (y < 0) y = 0;
    if (y + playerSize > canvas.height) y = canvas.height - playerSize;

    // Draw the player
    ctx.fillStyle = 'orange';
    ctx.fillRect(x, y, playerSize, playerSize);

    // Draw and update coins
    coins.forEach((coin) => {
        if (!coin.collected) {
            ctx.fillStyle = 'yellow';
            ctx.fillRect(coin.x, coin.y, coin.size, coin.size);
        }
    });

    // Check for player-coin collisions
    checkCoinCollision(x, y, playerSize, coins);

    // Update score based on collected coins
    score = coins.filter((coin) => coin.collected).length;

    // Display score at the top of the screen
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Score: ' + score, 20, 30);

    // Request the next frame
    requestAnimationFrame(() => updateGame(coins, checkCoinCollision));
}

// Start the game when the window is loaded
window.onload = function() {
    initializeGame(); // Initialize the game
};
