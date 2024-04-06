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

function generateCoins(canvas, ctx) {
    const coinSize = 75;
    const coinSpawnInterval = 500;

    for (let i = 0; i < 10; i++) {
        spawnCoin();
    }
    setInterval(() => {
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

    ctx.font = `${canvas.width * 0.05}px Arial`;
    const textWidth = ctx.measureText('Score: ' + score).width;
    const centerX = canvas.width / 2;
    const textX = centerX - textWidth / 2;
    const textY = canvas.height - canvas.width * 0.03;
    ctx.fillStyle = 'brown';
    ctx.fillText('Score: ' + score, textX, textY);

    requestAnimationFrame(() => updateGame(checkCoinCollision));
}
let gameStarted = false; // Add this line at the beginning of your script

function initializeGame() {
    const gameMessage = document.getElementById('gameMessage');
    gameMessage.style.display = 'block';
    window.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && !gameStarted) { // Check if the game has started
            gameStarted = true; // Set gameStarted to true when the game starts
            gameMessage.style.display = 'none';
            x = canvas.width / 2 - playerSize / 2;
            y = canvas.height / 2 - playerSize / 2;
            score = 0;
            const { checkCoinCollision } = generateCoins(canvas, ctx);
            updateGame(checkCoinCollision);
        }
    });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
}

function handleKeyDown(e) {
    if (e.code === 'KeyD') vxr = 10;
    if (e.code === 'KeyA') vxl = -10;
    if (e.code === 'KeyW') vy = -10;
    if (e.code === 'KeyS') vy = 10;
}

function handleKeyUp(e) {
    if (e.code === 'KeyD') vxr = 0;
    if (e.code === 'KeyA') vxl = 0;
    if (e.code === 'KeyW') vy = 0;
    if (e.code === 'KeyS') vy = 0;
}

window.onload = function() {
    initializeGame();
};
