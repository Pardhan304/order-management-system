# Order Management System (OMS)

A real-time, responsive order tracking dashboard built using React 19, Vite, and Axios for the frontend, connecting to a Node.js + Express + MongoDB database backend.

---

##  Project Architecture & Folder Structure

The project is structured into separate microservices layers:

```
Order Management System/
│
├── backend/                  # Node.js + Express.js API Server
│   ├── src/
│   │   ├── config/           # DB & environment settings
│   │   ├── constants/        # Status, workflow, and history mappings
│   │   ├── controllers/      # Route controllers parsing inputs
│   │   ├── cron/             # Scheduler cron jobs (run transitions every 5 mins)
│   │   ├── middlewares/      # Authentication, CORS, and validator checks
│   │   ├── models/           # Mongoose schemas (Order, Logs, History, Counter)
│   │   ├── routes/           # Endpoint path mappings
│   │   ├── services/         # Order creation & state transition logic
│   │   ├── utils/            # Custom helpers (Order ID generator)
│   │   └── validators/       # Request field assertions
│   │
│   └── .env                  # Backend configuration (DB URI, Ports, Secrets)
│
├── frontend/                 # React 19 + Vite Client application
│   ├── src/
│   │   ├── api/              # Axios helpers and endpoint interfaces
│   │   ├── components/       # Reusable layout, interactive widgets, and icons
│   │   │   ├── icons.jsx     # Shared SVG outline stroke icons library
│   │   │   └── ...
│   │   ├── hooks/            # Custom state orchestrators
│   │   │   └── useOrders.js
│   │   ├── pages/            # Page layouts
│   │   │   └── Dashboard.jsx
│   │   ├── styles/           # Modern custom CSS variable stylesheet
│   │   │   └── dashboard.css
│   │   ├── utils/            # Shared formatting utilities
│   │   │   └── formatters.js
│   │   ├── App.jsx           # App bootstrapping
│   │   └── main.jsx          # DOM rendering entrypoint
│   │
│   ├── index.html            # Entry HTML page
│   └── .env                  # Client-side configuration (base API URL)
│
├── API_DOCUMENTATION.md      # Detailed backend REST API specification
├── LOOM_SCRIPT.md            # Script and steps to record explanation video
└── README.md                 # Project guide (this file)
```

---

## 📐 System Design & Database Structure

### 1. Database Selection
* **MongoDB** was selected as the database. As a document-oriented NoSQL database, MongoDB aligns perfectly with JavaScript-centric stacks (Node/Express).
* It natively represents documents as BSON (JSON-like objects), allowing nested structures (e.g. status transition sub-histories or structured logs) to be retrieved and persisted cleanly.
* The flexible document structure makes database schemas easier to iterate on as workflows change, while built-in index support ensures fast queries at scale.

### 2. Collections/Schemas Created
* **Orders (`Order`)**: Represents individual customer purchases. Stores fields like customer details, product name, amount, current payment status (`PENDING`, `PAID`, `FAILED`), current order status (`PLACED`, `PROCESSING`, `READY_TO_SHIP`), and a `statusChangedAt` timestamp.
* **OrderStatusHistory (`OrderStatusHistory`)**: Tracks changes in an order's lifecycle. Stores references to the `Order` collection, initial status, target status, transition trigger (e.g. `SYSTEM`, `USER`, `ADMIN`), and change timestamp.
* **SchedulerLog (`SchedulerLog`)**: Documents background execution history. Records run statistics (durations, total matched records, successes, errors) and a nested `transitions` array capturing metrics for individual transition rules.
* **Counter (`Counter`)**: Contains atomic counter records used to generate incrementing, sequential order numbers (e.g., `ORD000001`) safely.

### 3. How Order Status History is Stored
* Every status update logs a document in `OrderStatusHistory`. 
* Instead of storing history directly within a large array inside the `Order` document (which could hit MongoDB's 16MB document size limit for high-activity orders), history is stored in a normalized collection.
* Documents reference the main `Order` model using Mongoose `Types.ObjectId` relations and have index coverage on `orderId` and `changedAt` for rapid retrieval.

### 4. How Scheduler Logs are Stored
* Execution logs are saved inside the `SchedulerLog` collection.
* Each document tracks the scheduler run session: start time, duration, aggregate successes, errors, and an array of objects representing a rule-by-rule breakdown (e.g. how many orders progressed from `PLACED` &rarr; `PROCESSING` vs. `PROCESSING` &rarr; `READY_TO_SHIP` in that specific run).

### 5. Preventing Duplicate Orders
* Handled at both database and logic levels:
  * **Unique Indexes**: A unique database index is defined on the `orderId` field in the Mongoose schema, preventing parallel saves or race conditions from introducing duplicate sequential order IDs.
  * **Idempotent Checks**: The custom sequential Order ID generator runs atomically against the `Counter` collection during order insertion inside a transaction session.

### 6. Managing Race Conditions & Data Integrity
* **ACID Transactions**: Both order creation and status transitions wrap multiple Mongoose database operations (inserting/updating orders, creating logs, updating counters) inside ACID sessions (`mongoose.startSession()` and `session.startTransaction()`).
* If any sub-operation fails (e.g. duplicate key validation error, network fault), the transaction is immediately rolled back using `session.abortTransaction()`, keeping the collections clean and consistent.

### 7. Scalability Planning
* **Application Layer**: The Express API server is completely stateless. It can be horizontally scaled behind a load balancer (such as Nginx, AWS ALBs, or Kubernetes Ingress) to support millions of connections.
* **Database Layer**: MongoDB sharding can split large datasets across multiple server shards using shard keys (e.g., compound key on `status` and `statusChangedAt`).
* **Scheduler Distribution**: Offload local cron loops to a centralized scheduler (like Google Cloud Scheduler, AWS EventBridge, or BullMQ with a Redis backend) to prevent parallel cron jobs from executing simultaneously on multiple horizontal container instances.
* **Caching**: Use a Redis caching layer for order lookup endpoints to reduce direct read operations on MongoDB.

### 8. Scheduler Choice
* **Simulated Local Cron**: Used `node-cron` to execute a local cron process every 5 minutes during development.
* **Production REST Trigger**: Designed a REST endpoint `/api/scheduler/run` protected by `x-scheduler-secret` header verification. In production, this endpoint allows serverless cloud schedulers (like Google Cloud Scheduler or Cron-Job.org) to trigger the process reliably without keeping memory-heavy cron daemons running in the server processes.

---

##  Environment Variables Setup

### Backend Environment Configuration (`backend/.env`)
Create a file named `.env` in the `backend/` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...     # MongoDB Connection String
SCHEDULER_SECRET=41170225b136d95ebdaf6fc76a16a087df3c4eff64c5fd2184eb01f04599f927
CLIENT_URL=http://localhost:5173  # CORS whitelist origin
```

### Frontend Environment Configuration (`frontend/.env`)
Create a file named `.env` in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

##  How to Run the Applications

### 1. Database & Backend Server Setup
Ensure MongoDB is running or configure an Atlas cluster.
```bash
# Navigate to the backend directory
cd backend

# Install server-side dependencies
npm install

# Start the Express server in development mode
npm run dev
# The server will launch on port 5000, connecting to MongoDB, and start the cron scheduler
```

### 2. Frontend client Setup
Open a new terminal window:
```bash
# Navigate to the frontend directory
cd frontend

# Install client-side dependencies
npm install

# Run the Vite React application
npm run dev
# The frontend will compile and start on http://localhost:5173
```

---

##  API Reference (Short Summary)

Detailed schemas and request/response structures are documented in **[API_DOCUMENTATION.md](file:///d:/Order%20Management%20System/API_DOCUMENTATION.md)**.
- **`GET /api/orders?status=`**: Returns list of orders sorted newest first. Supports status filtering.
- **`POST /api/orders`**: Creates a new order. Required body: `customerName`, `phone`, `productName`, `amount`.
- **`POST /api/scheduler/run`**: Triggers transition engine. Requires header `x-scheduler-secret`.

---

##  Implemented Features (Including Bonuses)

1. **Configurable Transition Engine**: Rather than hardcoding transitions, scheduler rules are data-driven. Configured rules:
   * `PLACED` &rarr; `PROCESSING` (after 10 minutes)
   * `PROCESSING` &rarr; `READY_TO_SHIP` (after 20 minutes)
2. **Text Search**: Built-in instant filtering by Order ID or Customer Name.
3. **Status Tabs**: Quick category tabs to isolate order lifecycles.
4. **Interactive Stats Circular Ring**: Visually summarizes total paid volume, average order values, and category counts using single-pass `useMemo` optimizations.
5. **Scheduler Execution Logs Dashboard**: The trigger modal renders rule-by-rule logs with processed and failed counts per transition configuration.
6. **Clean Architecture & Code**: Centralized SVG icons component library, cached numeric formatters, zero hardcoded secrets, and no commented-out code.
