# 📈 Stocklet

A full-stack stock trading platform where users can look up real-time stock quotes, track price history, manage a personal watchlist, and place buy/sell orders. Admins can approve or reject pending transactions and manage users.

## 🧰 Tech Stack

**Frontend:** React 19, Vite 7, TailwindCSS 4, React Router, Axios, Recharts, Lucide Icons

**Backend:** Go (Gin), MongoDB (Mongo Driver v2), JWT Authentication, bcrypt, Finnhub API

**Deployment:** Vercel (frontend)

## ✨ Features

### User Features
- 🔐 **Authentication** — Register & login with JWT-based session management
- 📊 **Dashboard** — Overview of your portfolio and market activity
- 🔍 **Market Page** — Browse and search stock symbols
- 📈 **Stock Details** — Real-time quotes from Finnhub API with historical price charts
- ⭐ **Watchlist** — Save your favorite stocks for quick access
- 💰 **Trading** — Place BUY/SELL orders with quantity and price
- 📋 **Transaction History** — View all your past orders and their statuses

### Admin Features
- ✅ **Transaction Management** — Approve or reject pending user transactions
- 👥 **User Management** — View all registered users and delete accounts
- 🛡️ **Role-Based Access** — Admin-only routes protected by middleware

## 📁 Project Structure

```
stocklet/
├── backend/
│   ├── config/          # Database connection (MongoDB)
│   ├── handlers/        # Route handlers (auth, stock, transaction, user, watchlist)
│   ├── middleware/       # JWT auth & admin role middleware
│   ├── model/           # Data models (User, Transaction)
│   ├── routes/          # API route definitions
│   ├── server.go        # Entry point
│   ├── .env.example     # Environment variable template
│   └── go.mod           # Go module dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # LoginForm, SignUpForm
│   │   │   ├── common/      # Navbar, ProtectRoute
│   │   │   ├── stock/       # StockCard, ChartComponent
│   │   │   └── trading/     # TransactionTable
│   │   ├── context/     # AuthContext, ThemeContext
│   │   ├── pages/       # All page components
│   │   ├── services/    # Axios API client
│   │   └── App.jsx      # Root component with routing
│   ├── vercel.json      # Vercel deployment config
│   └── package.json     # Node dependencies
│
└── .gitignore
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` — Create new user
- `POST /api/auth/login` — Login & get token

### Stocks
- `GET /api/stocks/:symbol` — Get real-time quote
- `GET /api/stocks/:symbol/history` — Get price history

### Transactions
- `POST /api/transactions` — Place a new order 🔒
- `GET /api/transactions/my-transactions` — Get your transactions 🔒
- `GET /api/transactions` — Get all transactions *(admin)* 🔒
- `PUT /api/transactions/:id/approve` — Approve a transaction *(admin)* 🔒
- `PUT /api/transactions/:id/reject` — Reject a transaction *(admin)* 🔒

### Watchlist
- `POST /api/watchlist` — Add symbol 🔒
- `GET /api/watchlist` — Get your watchlist 🔒
- `DELETE /api/watchlist/:symbol` — Remove symbol 🔒

### Users
- `GET /api/users` — List all users *(admin)* 🔒
- `DELETE /api/users/:id` — Delete a user *(admin)* 🔒

## 🚀 Getting Started

### Prerequisites
- **Go** 1.21+
- **Node.js** 18+
- **MongoDB** (local or Atlas)
- **Finnhub API Key** — get one free at [finnhub.io](https://finnhub.io/)

### Backend Setup

```bash
cd backend
cp .env.example .env
```

Fill in your `.env`:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/
MONGO_DB_NAME=stocklet
PORT=3000
JWT_SECRET=your_jwt_secret_here
STOCK_API_KEY=your_finnhub_api_key
FRONTEND_URL=http://localhost:5173
```

Run the server:
```bash
go run server.go
```

### Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

The `.env` file:
```env
VITE_API_URL=http://localhost:3000/api
```

The app will be running at `http://localhost:5173`.

## 🔒 Authentication Flow

1. User registers or logs in via `/api/auth`
2. Server returns a **JWT token** (valid for 10 days)
3. Frontend stores the token in `localStorage`
4. All authenticated requests include the token as `Authorization: Bearer <token>`
5. Auth middleware validates the token and attaches the user to the request context

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
