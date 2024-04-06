// coins.js

// Function to generate and manage coins
export function generateCoins(canvas, ctx) {
    const coinSize = 20; // Size of the coin
    let coins = []; // Array to store coin objects (position and status)

    // Function to randomly generate a new coin
    function spawnCoin() {
        // Randomly generate coordinates for the coin within the canvas bounds
        let coinX = Math.random() * (canvas.width - coinSize);
        let coinY = Math.random() * (canvas.height - coinSize);

        // Create a new coin object and add it to the coins array
        coins.push({ x: coinX, y: coinY, size: coinSize, collected: false });
    }

    // Spawn initial set of coins
    for (let i = 0; i < 5; i++) {
        spawnCoin();
    }

    // Function to draw and update coins
    function updateCoins() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw and update each coin
        coins.forEach((coin) => {
            if (!coin.collected) {
                ctx.fillStyle = 'yellow';
                ctx.fillRect(coin.x, coin.y, coin.size, coin.size);
            }
        });
    }

    // Start updating coins
    updateCoins();

    // Interval to spawn new coins every 3 seconds (adjust as needed)
    const coinSpawnInterval = 3000;
    setInterval(() => {
        for (let i = 0; i < 5; i++) {
            spawnCoin();
        }
    }, coinSpawnInterval);

    // Return coins array and checkCoinCollision function
    return {
        coins,
        checkCoinCollision: (playerX, playerY, playerSize) => {
            coins.forEach((coin, index) => {
                if (!coin.collected) {
                    // Calculate distances between player and coin centers
                    let coinCenterX = coin.x + coin.size / 2;
                    let coinCenterY = coin.y + coin.size / 2;
                    let playerCenterX = playerX + playerSize / 2;
                    let playerCenterY = playerY + playerSize / 2;

                    let dx = coinCenterX - playerCenterX;
                    let dy = coinCenterY - playerCenterY;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    // Check if player overlaps with the coin
                    if (distance < playerSize / 2 + coin.size / 2) {
                        coin.collected = true;
                        // Perform actions when a coin is collected (e.g., increase score)
                    }
                }
            });
        }
    };
}
