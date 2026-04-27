# ⛓️ ChainFund
====================================================================
   _____ _           _       ______               _ 
  / ____| |         (_)     |  ____|             | |
 | |    | |__   __ _ _ _ __ | |__ _   _ _ __   __| |
 | |    | '_ \ / _` | | '_ \|  __| | | | '_ \ / _` |
 | |____| | | | (_| | | | | | |  | |_| | | | | (_| |
  \_____|_| |_|\__,_|_|_| |_|_|   \__,_|_| |_|\__,_|
                                                    
====================================================================

> **A Smart Crowdfunding System using Simulated Blockchain Technology.**
> Empowering transparent, secure, and goal-oriented fundraising.

---

## 🌟 Features
* 🔐 **Secure Authentication** - Role-based access control (Creator vs. Donor) with JWT.
* 🚀 **Campaign Management** - Creators can easily launch and track campaigns.
* 💰 **Smart Donations** - Donors can fund active campaigns securely.
* 🛡️ **Simulated Blockchain Ledger** - Every donation creates an immutable block linked to the previous transaction hash.
* ⚖️ **Smart Contract Logic** - Automated settlement: releases funds upon reaching goals or triggers refunds if expired.
* 📊 **Ledger Explorer** - Real-time, transparent public view of all cryptographic blocks and transactions.
* 🎨 **Modern UI/UX** - Fully responsive, beautifully designed frontend using React and Tailwind CSS.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 18, Vite, Tailwind CSS v4, React Router v6, Axios, Recharts |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Blockchain Layer** | Custom Node.js Cryptographic Simulator (Crypto, UUID) |
| **Security** | JSON Web Tokens (JWT), bcryptjs |

---

## 📂 Project Structure

```text
chainfund/
├── backend/
│   ├── models/            # Mongoose Schemas (User, Campaign, Donation, Block)
│   ├── routes/            # Express API Routes
│   ├── middleware/        # JWT Auth and Role Guards
│   ├── utils/             # blockchainSim.js (Core Blockchain Logic)
│   ├── scripts/           # seed.js (Mock data generator)
│   ├── server.js          # Main Entry File
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI (Navbar, Cards, BlockchainLedger, etc.)
    │   ├── pages/         # Application Views (Home, Dashboard, Explorer, etc.)
    │   ├── context/       # AuthContext for global state
    │   ├── services/      # Axios API configuration
    │   ├── App.jsx        # Routing configuration
    │   └── index.css      # Tailwind v4 directives
    ├── index.html
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js (v16+)
* MongoDB (running locally on port 27017 or Atlas URI)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd chainfund
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Configure `.env` file (see Environment Variables section below).
```bash
# Optional: Seed the database with test users and campaigns
node scripts/seed.js

# Start the server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Configure `.env` file in the frontend folder.
```bash
# Start the client
npm run dev
```
The frontend will run on `http://localhost:5173` (or 5174).

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
| --- | --- |
| `PORT` | API Server Port (Default: 5000) |
| `MONGODB_URI` | MongoDB Connection String |
| `JWT_SECRET` | Secret key for signing JSON Web Tokens |

### Frontend (`frontend/.env`)
| Variable | Description |
| --- | --- |
| `VITE_API_URL` | Full URL of the Backend API (e.g., `http://localhost:5000/api`) |

---

## 📡 API Endpoints

| Method | Route | Auth Required | Description |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | No | Register a new User/Creator/Donor |
| `POST` | `/api/auth/login` | No | Login and receive JWT |
| `GET`  | `/api/campaigns` | No | Fetch all public campaigns |
| `GET`  | `/api/campaigns/:id` | No | Fetch campaign details and donors |
| `POST` | `/api/campaigns` | Yes (Creator) | Create a new campaign |
| `GET`  | `/api/campaigns/my/campaigns` | Yes (Creator) | Get logged-in creator's campaigns |
| `POST` | `/api/donations/donate/:id` | Yes (Donor) | Donate to a campaign & generate block |
| `GET`  | `/api/blockchain/blocks` | No | View all simulated blocks |
| `GET`  | `/api/blockchain/blocks/:id` | No | View specific block details |
| `GET`  | `/api/blockchain/transactions` | No | View all transactions |

---

## 🔗 Blockchain Simulation Explained

Instead of interacting with a costly public testnet, ChainFund uses an advanced **Simulated Blockchain Ledger** locally on the Node.js backend.

* **Blocks**: Every time a donation occurs, the system compiles the transaction data, timestamps it, and assigns a mathematical nonce.
* **Hashing**: Using `crypto.createHash('sha256')`, the system generates an immutable, unique hexadecimal string for that block.
* **The Chain**: The new block specifically incorporates the `hash` of the previous block as its `previousHash`. This cryptographic link ensures that no past transaction can be altered without breaking the subsequent hashes—mimicking the core security principle of actual blockchain networks.

---

## 📜 Smart Contract Logic

A "Smart Contract" is a self-executing program that runs when predetermined conditions are met. ChainFund simulates this autonomously:
* **The Settle Trigger**: After every donation, and periodically every 60 seconds (via a cron-like interval).
* **Funded Condition**: If `campaign.raisedAmount >= campaign.goalAmount`, the contract status changes to `funded`, mathematically "releasing" the funds to the creator.
* **Refund Condition**: If `current_date > campaign.deadline` AND `raisedAmount < goalAmount`, the contract status changes to `failed`, triggering a simulated "refund" to all donors.

---

## 📸 Screenshots

*Add screenshots here.*
*(e.g., Home Page, Campaign Details, Ledger Explorer)*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
