# Vertical Platformer Game

## Overview
This project is a vertical platformer game built using Phaser. The objective is to ascend as high as possible by jumping on randomly generated platforms. The game allows for infinite upward movement without a height limit, providing a continuous challenge for players.

## Project Structure
```
vertical-platformer
├── src
│   ├── main.js          # Entry point of the game
│   ├── scenes
│   │   └── Game.js     # Main game logic and scene management
│   ├── objects
│   │   ├── Player.js    # Player character representation
│   │   └── Platform.js   # Platform representation
│   └── utils
│       └── PlatformGenerator.js # Random platform generation logic
├── package.json         # NPM configuration and dependencies
└── README.md            # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd vertical-platformer
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Running the Game
To start the game, run the following command:
```
npm start
```
This will launch the game in your default web browser.

## Gameplay
- Use the arrow keys or 'WASD' to move the player.
- Jump on platforms to ascend higher.
- Platforms are generated randomly as you progress, so stay alert!

## Contributing
Feel free to submit issues or pull requests if you have suggestions or improvements for the game. 

## License
This project is licensed under the MIT License.