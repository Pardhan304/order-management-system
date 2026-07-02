# Order Management System (OMS)

A real-time, responsive order tracking dashboard built using React 19, Vite, and Axios for the frontend, connecting to a Node.js + Express + MongoDB database backend.

---

## 🛠️ Project Architecture & Folder Structure

The project is structured into separate microservices layers:

```
Order Management System/
│
├── backend/                  # Node.js + Express.js API Server
│   ├── src/
│   │   ├── config/           # DB & environment settings
│   │   ├── constants/        # Status and workflow enum mappings
│   │   ├── controllers/      # Route controllers parsing inputs
│   │   ├── cron/             # Scheduler cron jobs (run transitions every 5 mins)
│   │   ├── middlewares/      # Authentication, CORS, and validator check
│   │   ├── models/           # Mongoose schemas (Order, Logs, History)
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
│   │   │   ├── axios.js
│   │   │   ├── orderApi.js
│   │   │   └── schedulerApi.js
│   │   │
│   │   ├── components/       # Reusable layout and interactive widgets
│   │   │   ├── Header.jsx
│   │   │   ├── StatusFilter.jsx
│   │   │   ├── OrdersTable.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── RefreshButton.jsx
│   │   │   ├── CreateOrderModal.jsx
│   │   │   └── SchedulerModal.jsx
│   │   │
│   │   ├── hooks/            # Custom state orchestrators
│   │   │   └── useOrders.js
│   │   │
│   │   ├── pages/            # Page layouts
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── styles/           # Modern custom CSS variable stylesheet
│   │   │   └── dashboard.css
│   │   │
│   │   ├── App.jsx           # App bootstrapping
│   │   └── main.jsx          # DOM rendering entrypoint
│   │
│   ├── index.html            # Entry HTML page
│   └── .env                  # Client-side configuration (base API URL)
│
├── API_DOCUMENTATION.md      # Detailed backend REST API specification
└── README.md                 # Project guide (this file)
```

---

## 🔑 Environment Variables Setup

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

## ⚡ How to Run the Applications

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

## 🖥️ Screen Mockups & Visual Flow Placeholder

Below are visual guides to the main features implemented in the dashboard:

```
+-----------------------------------------------------------------------------+
|  📦 Order Flow  [Syncing in 24s] [🔄 Refresh]  ⚙️ Scheduler  ➕ Create Order  |
|  Real-time order management dashboard                                       |
+-----------------------------------------------------------------------------+
|  Total: 42 | Paid: 30 | Pending: 10 | Failed: 2 | Placed: 12 | Processing: 5 |
+-----------------------------------------------------------------------------+
|  [ All ]  [ PLACED ]  [ PROCESSING ]  [ READY_TO_SHIP ]  [ DELIVERED ]       |
+-----------------------------------------------------------------------------+
|  🔍 [ Search by ID, Customer or Product...                             ]   |
+-----------------------------------------------------------------------------+
|  Order ID  | Customer Name | Phone        | Product    | Amount | Status    |
|  ----------+---------------+--------------+------------+--------+-----------|
|  ORD000042 | John Doe      | +1 555-0199  | Keyboard   | $99.99 | [PLACED]  |
|  ORD000041 | Alice Smith   | 9876543210   | Laptop     | $1,299 | [PAID]    |
|  ...       | ...           | ...          | ...        | ...    | ...       |
+-----------------------------------------------------------------------------+
|  Showing Page 1 of 6                                      [◀]  1  [▶]       |
+-----------------------------------------------------------------------------+
```

---

## 📑 API Reference (Short Summary)

Detailed schemas and request/response structures are documented in **[API_DOCUMENTATION.md](file:///d:/Order%20Management%20System/API_DOCUMENTATION.md)**.
- **`GET /api/orders?status=`**: Returns list of orders sorted newest first. Supports status filtering.
- **`POST /api/orders`**: Creates a new order. Required body: `customerName`, `phone`, `productName`, `amount`.
- **`POST /api/scheduler/run`**: Triggers cron engine to transition orders from `PLACED` to `PROCESSING`. Requires header `x-scheduler-secret`.

---

## 🔮 Future Improvements

1. **Server-Side Pagination & Searching**:
   - The current API returns all orders. As the volume grows, load times will degrade. Refactoring the API to support `?page=`, `?limit=`, and `?search=` query arguments is a key next step.
2. **Websockets (Socket.io)**:
   - Introduce WebSocket connections for real-time dashboard sync, instead of relying on the 30-second polling interval.
3. **Database Index Optimizations**:
   - Index the `customerName` and `orderId` fields in Mongoose to support fast textual queries if server-side searching is implemented.
4. **Enhanced Authorization**:
   - Introduce JWT login security tokens for administrative changes, replacing simple header string secret codes.
