const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 2560;
canvas.height = 1440;

let x = canvas.width / 2 - 25;
let y = canvas.height / 2 - 25;
let vxr = 0;
let vxl = 0;
let vy = 0;
const playerSize = 100;
let score = 0;
let coins = [];
let gameStarted = false;
let enemies = [];
let enemySpeed = 3;

// Create an audio element for background music
const bgMusic = document.getElementById('bgMusic');
bgMusic.loop = true;
bgMusic.volume = 0.1;

// Create audio elements for game sounds
const deathSound = new Audio('audio/Death.mp3');
deathSound.volume = 0.1;
const coinCollectedSound = new Audio('audio/CoinCollected.mp3');
coinCollectedSound.volume = 0.1;

function generateCoins(canvas, ctx) {
    const coinSize = 75;
    const coinSpawnInterval = 500;

    for (let i = 0; i < 10; i++) {
        spawnCoin();
    }
    coinSpawnIntervalId = setInterval(() => {
        if (coins.length < 100) {
            spawnCoin();
        }
    }, coinSpawnInterval);

    function spawnCoin() {
        let coinX = Math.random() * (canvas.width - coinSize);
        let coinY = Math.random() * (canvas.height - coinSize);
        coins.push({ x: coinX, y: coinY, size: coinSize, collected: false });
    }

    return {
        checkCoinCollision: (playerX, playerY, playerSize) => {
            coins = coins.filter((coin, index) => {
                if (!coin.collected) {
                    let coinCenterX = coin.x + coin.size / 2;
                    let coinCenterY = coin.y + coin.size / 2;
                    let playerCenterX = playerX + playerSize / 2;
                    let playerCenterY = playerY + playerSize / 2;
                    let dx = coinCenterX - playerCenterX;
                    let dy = coinCenterY - playerCenterY;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < playerSize / 2 + coin.size / 2) {
                        coin.collected = true;
                        score++;
                        if (score > 0 && score % 10 === 0) {
                            coinCollectedSound.play(); // Play coin collected sound for every 10 points
                            spawnEnemies(Math.floor(score / 10)); // Spawn enemies based on score
                            enemySpeed += 0.5; // Increase enemy speed
                        }
                        return false; // remove the collected coin from the array
                    }
                }
                return true; // keep the uncollected coins
            });
        }
    };
}

function updateGame(checkCoinCollision) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    x += vxr + vxl;
    y += vy;
    if (x < 0) x = 0;
    if (x + playerSize > canvas.width) x = canvas.width - playerSize;
    if (y < 0) y = 0;
    if (y + playerSize > canvas.height) y = canvas.height - playerSize;
    ctx.fillStyle = 'orange';
    ctx.fillRect(x, y, playerSize, playerSize);

    // Move existing enemies towards the player
    if (gameStarted) {
        enemies.forEach((enemy) => {
            const dx = x - enemy.x;
            const dy = y - enemy.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance !== 0) {
                enemy.vx = (dx / distance) * enemySpeed;
                enemy.vy = (dy / distance) * enemySpeed;

                enemy.x += enemy.vx;
                enemy.y += enemy.vy;

                // Normalize enemy velocity
                normalizeEnemyVelocity(enemy);
            }
        });
    }

    // Draw all enemies
    drawEnemies();

    coins.forEach((coin) => {
        if (!coin.collected) {
            ctx.beginPath();
            ctx.arc(coin.x + coin.size / 2, coin.y + coin.size / 2, coin.size / 2, 0, Math.PI * 2);
            ctx.fillStyle = 'yellow';
            ctx.fill();
            ctx.closePath();
        }
    });

    checkCoinCollision(x, y, playerSize);

    // Check collision with any enemy
    if (checkEnemyCollision()) {
        gameOver();
        return;
    }

    ctx.font = `${canvas.width * 0.05}px Arial`;
    const textWidth = ctx.measureText('Score: ' + score).width;
    const centerX = canvas.width / 2;
    const textX = centerX - textWidth / 2;
    const textY = canvas.height - canvas.width * 0.03;
    ctx.fillStyle = 'brown';
    ctx.fillText('Score: ' + score, textX, textY);

    requestAnimationFrame(() => updateGame(checkCoinCollision));
}

function normalizeEnemyVelocity(enemy) {
    const speed = Math.sqrt(enemy.vx * enemy.vx + enemy.vy * enemy.vy);
    if (speed > enemySpeed) {
        const factor = enemySpeed / speed;
        enemy.vx *= factor;
        enemy.vy *= factor;
    }
}

function spawnEnemies(count) {
    for (let i = 0; i < count; i++) {
        let newEnemy = getRandomPositionAwayFromPlayer();
        enemies.push({ ...newEnemy, speed: enemySpeed });
    }
}

function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);
    });
}

function checkEnemyCollision() {
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (Math.abs(x - enemy.x) < playerSize && Math.abs(y - enemy.y) < playerSize) {
            return true;
        }
    }
    return false;
}

function gameOver() {
    gameStarted = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'red';
    ctx.font = `${canvas.width * 0.1}px Arial`;

    // Display "Game Over!" message
    ctx.fillText('Game Over!', canvas.width * 0.25, canvas.height * 0.3);

    // Display player's score below the "Game Over!" message
    ctx.font = `${canvas.width * 0.05}px Arial`;
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, canvas.width * 0.4, canvas.height * 0.4);

    // Clear the coins array
    coins = [];

    // Reset enemies array and enemy speed
    enemies = [];
    enemySpeed = 3;

    clearInterval(coinSpawnIntervalId);
    coinSpawnIntervalId = 0;

    // Play death sound
    deathSound.play();

    // Display "Press Spacebar to Play Again" instruction at the bottom
    ctx.font = `${canvas.width * 0.03}px Arial`;
    ctx.fillText('Press Spacebar to Play Again', canvas.width * 0.32, canvas.height * 0.7);

    // Pause background music & reset to 0 seconds
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function initializeGame() {
    const gameMessage = document.getElementById('gameMessage');
    gameMessage.style.display = 'block';

    // Reload the background music to start from the beginning
    bgMusic.load();

    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && !gameStarted) {
            gameStarted = true;
            gameMessage.style.display = 'none';
            x = canvas.width / 2 - playerSize / 2;
            y = canvas.height / 2 - playerSize / 2;
            score = 0;
            coins = []; // Reset coins array when starting a new game
            enemies = []; // Reset enemies array
            enemySpeed = 3; // Reset enemy speed
            spawnEnemies(1); // Spawn initial enemy
            const { checkCoinCollision } = generateCoins(canvas, ctx);
            updateGame(checkCoinCollision);

            // Restart background music from the beginning
            bgMusic.play()
                .then(() => console.log('Background music started'))
                .catch(error => console.error('Failed to start background music:', error));
        }
    });

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

function getRandomPositionAwayFromPlayer() {
    let enemyX, enemyY;
    do {
        enemyX = Math.random() * canvas.width;
        enemyY = Math.random() * canvas.height;
    } while (Math.abs(enemyX - x) < 200 && Math.abs(enemyY - y) < 200);
    return { x: enemyX, y: enemyY, size: 80 };
}

function handleKeyDown(e) {
    if (e.code === 'KeyD') vxr = 10;
    if (e.code === 'KeyA') vxl = -10;
    if (e.code === 'KeyW') vy = -10;
    if (e.code === 'KeyS') vy = 10;

    // Normalize the velocity vector to prevent increased speed when moving diagonally
    normalizeVelocity();
}

function handleKeyUp(e) {
    if (e.code === 'KeyD' && vxr > 0) vxr = 0;
    if (e.code === 'KeyA' && vxl < 0) vxl = 0;
    if (e.code === 'KeyW' && vy < 0) vy = 0;
    if (e.code === 'KeyS' && vy > 0) vy = 0;

    // Normalize the velocity vector
    normalizeVelocity();
}

function normalizeVelocity() {
    const speed = Math.sqrt(vxr * vxr + vxl * vxl + vy * vy);
    if (speed > 10) {
        const factor = 10 / speed;
        vxr *= factor;
        vxl *= factor;
        vy *= factor;
    }
}

// Initialize the game when the window finishes loading
window.onload = function() {
    initializeGame();
};
