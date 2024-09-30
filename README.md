# fetch-backend-api
A RESTful API for managing user points by tracking transactions from multiple payers. Users can add points, spend points following an "oldest-first" policy, and check their current balance by payer. The application is built using Node.js and Express.js, with a min-heap (priority queue) to ensure efficient point spending.

Features:
- Add, spend, and view point balances.
- Efficient management of transactions using a min-heap data structure.
- Error handling for edge cases, including negative balances and insufficient points.
- Extensible for further enhancements like database integration and caching.

Tech stack:
- Node.js and Express.js for server-side development.
- Min-Heap (Priority Queue) to optimize point spending.
- JSON-based endpoints for easy integration with front-end applications or other services.

Future Enhancements:
- Persistent data storage with MongoDB or PostgreSQL.
- Caching with Redis for improved performance.
- JWT-based authentication for secure access.
