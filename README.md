# Multiplayer Game System Overview

This project is a real-time multiplayer game system built using WebSockets, designed to allow players to join, spectate, and play games against each other in a dynamic and engaging environment. The system supports features such as game invitations, real-time moves, game management, and player interactions.

The application is implemented with TypeScript, Node.js, and the ws WebSocket library. It leverages an efficient backend architecture to handle player connections, game state synchronization, and secure message handling.

## Skills Demonstrated
- **WebSocket Communication**: Implemented real-time communication using WebSockets, enabling low-latency updates between clients (players) and the server.
- **Backend Development (Node.js/TypeScript)**: Developed a scalable backend with Node.js and TypeScript, utilizing asynchronous programming to handle multiple player connections and game states.
- **Game Logic & State Management**: Created a game manager system to track and manage game states, including board positions, moves, and player actions in real-time.
- **Client-Server Interaction**: Managed player interactions using a message-based protocol with error handling, ensuring smooth gameplay and proper synchronization between players.
- **Invitation & Friend Interaction**: Integrated an invitation system, allowing players to invite friends to play games, with built-in timeouts to handle inactivity.

## Features

- **Join Game**: Players can join available games or create a new game to play.
- **Spectate Game**: Players can spectate an ongoing game without participating. If no game is available, they can be randomly assigned to an active game.
- **Game Moves**: Players can make moves on a virtual chessboard, with real-time updates for both the player and their opponent.
- **Game Over**: Players can declare the game over and it will be removed from the active game list.
- **Game Invitations**: Players can invite friends to play, with a built-in time limit for invitation acceptance. If the invitation expires, it is canceled.
- **Error Handling & Validation**: Comprehensive error handling ensures players receive clear feedback when something goes wrong (e.g., invalid game IDs, not in a game, etc.).

## Technologies Used
- **Node.js**: A JavaScript runtime to handle the backend logic.
- **TypeScript**: Strongly typed programming language for scalable and maintainable code.
- **WebSockets**: A communication protocol to establish real-time, full-duplex communication channels between players and the server.
- **Jest**: A testing framework to ensure the integrity of the application and its features.
- **ws Library**: WebSocket server library to manage player connections and message handling.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/Studycode001/chessgame.git
    cd chessgame
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the WebSocket server:
    ```bash
    npm run start
    ```
    The server will run on `ws://localhost:8000`.
