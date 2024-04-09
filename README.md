## 🕹️ Simple Movement Game Documentation

Welcome to the documentation for the Simple Movement Game project. This document provides an overview of the game's functionality, structure, and how to interact with it.

### 🌟 Overview

This project is a simple browser-based game where the player controls a character using the WASD keys to collect coins while avoiding enemies. The game is built using HTML5 Canvas for rendering graphics and JavaScript for game logic.

### 🎮 Features

- **Player Movement**: Use the **W**, **A**, **S**, **D** keys to move the player character around the game canvas.
- **Coin Collection**: Collect yellow coins scattered across the canvas to increase your score.
- **Enemy Avoidance**: Red enemies move towards the player. Avoid colliding with them to stay alive.
- **Score Tracking**: Your score increases with each coin collected. The game ends if you collide with an enemy.
- **Audio Effects**: Background music and sound effects enhance the gaming experience.

### 📜 Instructions

1. **Starting the Game**:
   - Press the **Spacebar** to start the game.
   - Once started, use **W**, **A**, **S**, **D** keys to move the player.

2. **Gameplay**:
   - Collect yellow coins to increase your score.
   - Every 10 coins collected, the enemy count increases, and their speed goes up.
   - Avoid colliding with red enemies.

3. **Game Over**:
   - The game ends if you collide with an enemy.
   - Your final score will be displayed along with an option to restart by pressing **Spacebar**.

### 📁 Project Structure

The project consists of the following key components:

- **HTML (`index.html`)**:
  - Contains the structure of the game, including canvas and game message elements.
  - Links to necessary CSS and JavaScript files.

- **JavaScript (`scripts/main.js`)**:
  - Manages game logic, including player movement, coin and enemy generation, collision detection, and game over conditions.
  - Handles user input for player movement and game start/restart.
  
- **CSS (`css/styles.css`)**:
  - Provides styling for the game canvas and UI elements.

- **Assets (`audio/`)**:
  - Contains audio files used for background music and game sounds.

### ⚙️ Setup

Visit 

To run the game locally:

1. Clone the repository to your local machine.
2. Open `index.html` in a web browser that supports HTML5 Canvas.
3. Press **Spacebar** to start the game.
4. Use **W**, **A**, **S**, **D** keys to move the player and collect coins.
5. Enjoy playing!

### 🎉 Conclusion

The Simple Movement Game project is a fun exercise in basic game development using HTML5 Canvas and JavaScript. It demonstrates fundamental game mechanics like player movement, collision detection, and score tracking. Feel free to modify and expand upon this project for further learning and enjoyment!

If you have any questions or suggestions, please reach out to the project's author through the GitHub repository.

Enjoy gaming! 🕹️
