# Tic Tac Toe

**A basic Tic Tac Toe game built using HTML, JavaScript, and CSS. No dependencies required.**


## How to Get Started
1. To make a move, the player will use a single mouse click to mark a space. In this version, there is no provision to undo a move. Once a move is made, the game proceeds to the next player's turn.
2. At each move, the game will indicate whose turn (Player A or Player B) it is. When the game ends, it displays one of the following outcomes:
   * Winner: Player A
   * Winner: Player B
   * Draw


   # 🕹️ Tic Tac Toe Game (SENG660 Updates)

A simple full-stack Tic Tac Toe game built with:

- Vanilla JS frontend (served with Vite)
- Node.js + Express backend
- PostgreSQL database
- User authentication with Passport.js
## 🚀 How to Run This Project

### 📦 Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v20 or higher
- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Git Bash or PowerShell (on Windows)

---

### 📁 Folder Structure
```plaintext
tic-tac-toe-js/
├── backend/ ← Node.js API server
├── frontend/ ← HTML/CSS/JS frontend with Vite
├── docker-compose.yml ← Multi-container setup
└── README.md
```

### 🔧 Step-by-Step Setup

### 1. Clone the Repo

```bash
git clone <your-repo-url>
cd tic-tac-toe-js
```

### 2. Start Everything with Docker

This will run:

- **PostgreSQL** (for storing users and game logs)
- **Express backend** at `http://localhost:8000`
- **Frontend** (Vite) at `http://localhost:5173`

```bash
docker compose up --build
```

#### 3. Open the App

Once everything is running, open your browser and go to:

#### 4. Backend Routes (For Testing)

| Method | Route         | Description             |
|--------|---------------|-------------------------|
| POST   | `/register`   | Register a new user     |
| POST   | `/login`      | Log in (local session)  |
| GET    | `/protected`  | Check if logged in      |
| POST   | `/log-game`   | Save game result        |
## 🧪 Development Tips

### ▶️ Start frontend only (with live reload)

```bash
cd frontend
npm install
npm run dev
```

## ✅ Features

- Classic 3x3 Tic Tac Toe
- Toggle dark/light theme
- User registration & login
- Game results logged to PostgreSQL database
