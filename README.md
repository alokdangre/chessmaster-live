Multiplayer Game System
Overview
This project is a real-time multiplayer game system built using WebSockets, designed to allow players to join, spectate, and play games against each other in a dynamic and engaging environment. The system supports features such as game invitations, real-time moves, game management, and player interactions.

The application is implemented with TypeScript, Node.js, and the ws WebSocket library. It leverages an efficient backend architecture to handle player connections, game state synchronization, and secure message handling.

Skills Demonstrated
WebSocket Communication: Implemented real-time communication using WebSockets, enabling low-latency updates between clients (players) and the server.
Backend Development (Node.js/TypeScript): Developed a scalable backend with Node.js and TypeScript, utilizing asynchronous programming to handle multiple player connections and game states.
Game Logic & State Management: Created a game manager system to track and manage game states, including board positions, moves, and player actions in real time.
Client-Server Interaction: Managed player interactions using a message-based protocol with error handling, ensuring smooth gameplay and proper synchronization between players.
Invitation & Friend Interaction: Integrated an invitation system, allowing players to invite friends to play games, with built-in timeouts to handle inactivity.
Features
1. Join Game
Players can join available games or create a new game to play.
2. Spectate Game
Players can spectate an ongoing game without participating. If no game is available, they can be randomly assigned to an active game.
3. Game Moves
Players can make moves on a virtual chessboard, with real-time updates for both the player and their opponent.
4. Game Over
Players can declare the game over and it will be removed from the active game list.
5. Game Invitations
Players can invite friends to play, with a built-in time limit for invitation acceptance. If the invitation expires, it is canceled.
6. Error Handling & Validation
Comprehensive error handling ensures players receive clear feedback when something goes wrong (e.g., invalid game IDs, not in a game, etc.).
Technologies Used
Node.js: A JavaScript runtime to handle the backend logic.
TypeScript: Strongly typed programming language for scalable and maintainable code.
WebSockets: A communication protocol to establish real-time, full-duplex communication channels between players and the server.
Jest: A testing framework to ensure the integrity of the application and its features.
ws Library: WebSocket server library to manage player connections and message handling.
Installation
To run this project locally, follow these steps:

Clone the repository:

bash
Copy code
git clone https://github.com/your-username/multiplayer-game-system.git
cd multiplayer-game-system
Install dependencies:

bash
Copy code
npm install
Start the WebSocket server:

bash
Copy code
npm run start
The server will run on ws://localhost:8000.

Testing
To ensure the integrity of the system, unit tests are written for all critical functionalities, including:

WebSocket connection handling
Game join and spectate logic
Game move validations
Invitation flow with time limits
To run the tests:

Run tests using Jest:

bash
Copy code
npm run test
How it Works
WebSocket Flow:
Players connect to the server using a WebSocket connection.
Players can join games or spectate existing games.
Players send and receive messages in real-time to update the game state.
Game state is continuously updated on the backend, with any move or game change communicated to the relevant players.
Players can send invitations to friends, and these invitations come with a time limit for accepting the invitation.
Invitation Flow:
Invite: A player can send an invitation to a friend. If the friend is online, they will receive an invitation message.
Accept: The invited player can either accept or reject the invitation within a time limit.
Timeout: If the invited player does not respond in time, the invitation expires.
Example Use Case
Imagine two players, Alice and Bob, are playing a game:

Alice sends an invitation to Bob to play a game. Bob is online and receives the invitation with a countdown timer.
Bob accepts the invitation, and both players are placed into a new game.
They start making moves in real-time, with the board state automatically synchronized between both players.
If one of them disconnects, the game handles the disconnection and updates both players about the status.
Contribution
Feel free to contribute to this project. You can start by:

Forking the repository.
Creating a new branch for your changes.
Submitting a pull request with a detailed description of your changes.
License
This project is licensed under the MIT License - see the LICENSE file for details.

Conclusion
This Multiplayer Game System showcases real-time game interactions using WebSockets, enabling players to join, spectate, and play against each other seamlessly. The application demonstrates various backend technologies, efficient state management, and real-time communication, making it a perfect example of a robust multiplayer game backend.

