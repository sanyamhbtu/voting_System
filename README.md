# 🗳️ VoteChain — Blockchain Voting Management System

A secure, transparent, end-to-end voting platform. Voters and parties register with identity
(and optional face) verification, the election commission manages the election, and every ballot
is cast on-chain so results are tamper-proof and independently verifiable.

> **Stack:** React 18 + Vite + TypeScript + Tailwind CSS v4 (frontend) · Node/Express + MongoDB +
> ethers.js + Google Cloud Vision/Storage + Python face-recognition (backend) · Solidity + Foundry
> (smart contract).

---

## 📁 Monorepo layout

| Folder       | What it is                                                              |
| ------------ | ---------------------------------------------------------------------- |
| `Frontend/`  | Vite + React SPA (landing, auth, voter/admin/party dashboards)         |
| `Backend/`   | Express API, WebSocket broadcast, blockchain bridge, OCR/face checks   |
| `Contracts/` | `Voting.sol` smart contract + Foundry deploy script                    |

---

## 🚀 Quick start (local)

### Prerequisites
- Node.js 20+, npm
- Python 3.10+ with `pip` (for face verification)
- A MongoDB instance (local or free [MongoDB Atlas](https://www.mongodb.com/atlas))
- An EVM RPC endpoint + a deployed `Voting` contract (see [Contracts](#-smart-contract))
- A Google Cloud service-account JSON with Vision + Storage enabled

### 1. Backend
```bash
cd Backend
npm install
npm run py:install            # installs Python deps from requirements.txt
cp .env.example .env          # then fill in the values
npm run dev                   # builds TS and starts on http://localhost:3000
```

### 2. Frontend
```bash
cd Frontend
npm install
cp .env.example .env          # defaults point at http://localhost:3000
npm run dev                   # http://localhost:5173
```

---

## 🔐 Environment variables

Secrets live in `.env` files (git-ignored). Templates are checked in as `.env.example`.

**Backend** (`Backend/.env`) — `PORT`, `FRONTEND_URL`, `JWT_SECRET_KEY`, `MONOGDB_URL`,
`RPC_URL`, `META_PRIVATE_KEY`, `CONTRACT_ADDRESS`, `MNEOMONIC`, and Google Cloud creds
(`GCP_CREDENTIALS_JSON` **or** `GOOGLE_APPLICATION_CREDENTIALS`) + `GCS_BUCKET`.

**Frontend** (`Frontend/.env`) — `VITE_API_URL`, `VITE_WS_URL`, and the `VITE_FIREBASE_*` keys.

> ⚠️ **Never commit real secrets.** The Google service-account key, `.env` files, and `*.json`
> credential files are all git-ignored. On hosting providers, set credentials as environment
> variables (use `GCP_CREDENTIALS_JSON` with the full JSON pasted inline).

---

## 🌐 Deploy for free ($0)

Everything below has a usable free tier.

| Piece     | Provider                | Notes                                            |
| --------- | ----------------------- | ------------------------------------------------ |
| Database  | MongoDB Atlas (M0)      | Free 512 MB cluster                              |
| Backend   | Render (Docker, free)   | Node + Python in one container                   |
| Frontend  | Vercel **or** Render    | Static SPA                                        |
| Contract  | Any EVM testnet         | Sepolia + free RPC (Alchemy/Infura/public)       |

### Option A — one repo, one click (Render Blueprint)
1. Push this repo to GitHub.
2. In Render → **New → Blueprint**, point it at the repo. It reads [`render.yaml`](./render.yaml)
   and provisions the backend (Docker) **and** the frontend (static site).
3. Fill the `sync: false` env vars in the dashboard (DB URL, RPC, GCP JSON, Firebase, and set
   `FRONTEND_URL`/`VITE_API_URL`/`VITE_WS_URL` to the generated service URLs).

### Option B — Vercel (frontend) + Render (backend)
- **Frontend on Vercel:** import the repo, set **Root Directory = `Frontend`**. [`vercel.json`](./Frontend/vercel.json)
  handles the SPA rewrites. Add the `VITE_*` env vars.
- **Backend on Render:** New → **Web Service** → Docker, root `Backend/`. Add the backend env vars.

> 💤 Render's free web service sleeps after ~15 min idle, so the first request after a nap is slow.
> `face-recognition` (dlib) makes the Docker image large and the first build slow — this is normal.

---

## 📜 Smart contract

```bash
cd Contracts
forge build
forge script script/Deploy.s.sol --rpc-url <RPC_URL> --private-key <KEY> --broadcast
```
Copy the deployed address into `Backend/.env` as `CONTRACT_ADDRESS`. The ABI the backend uses lives
in `Backend/ABIs/Voting.json`.

---

## 🧪 Build / verify

```bash
# Frontend
cd Frontend && npm run build

# Backend
cd Backend && npm run build
```

---

## 🏗️ Architecture notes
- **Auth:** JWT issued by the backend, stored as a cookie; protected routes use the `middleware`.
- **Voting:** each registered voter is allocated one non-transferable token on-chain; `vote()` enforces
  one-person-one-vote and respects the election deadline.
- **Realtime:** new broadcasts are pushed to voter dashboards over WebSocket.
- **Verification:** Google Vision OCR reads ID documents; a Python `face-recognition` step matches the
  selfie to the document photo.
