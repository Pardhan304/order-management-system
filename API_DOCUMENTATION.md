# Order Management System - Backend API Reference Guide

This documentation specifies the REST APIs provided by the Node.js/Express backend server. All requests are handled via JSON formatting.

---

## 1. Create New Order

Creates a new order in the database and records its initial status in the history log.

- **Method**: `POST`
- **URL**: `/api/orders`
- **Headers**:
  - `Content-Type: application/json`

### Body Parameters
| Parameter | Type | Required | Default | Validation Rules | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `customerName` | String | Yes | - | Cannot be empty or whitespace | Full name of the customer |
| `phone` | String | Yes | - | Must be a valid telephone format | Contact number |
| `productName` | String | Yes | - | Cannot be empty or whitespace | Product name/identifier |
| `amount` | Number | Yes | - | Must be a positive decimal (`> 0`) | Total sale price of order |
| `paymentStatus`| String | No | `PENDING`| Must be: `PENDING`, `PAID`, or `FAILED` | Payment condition |

### API Validation Rules
- `customerName` is required and will be automatically trimmed.
- `phone` must be a valid mobile phone number format (validated via `express-validator.isMobilePhone`).
- `productName` is required and will be trimmed.
- `amount` must be a valid number greater than 0.
- `paymentStatus` is optional but if provided must match the list `[PENDING, PAID, FAILED]`.

### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "64bcde824b21d5a71a069f23",
    "orderId": "ORD000001",
    "customerName": "John Doe",
    "phone": "+15551234567",
    "productName": "Ergonomic Office Chair",
    "amount": 299.99,
    "paymentStatus": "PAID",
    "status": "PLACED",
    "statusChangedAt": "2026-07-01T15:21:54.000Z",
    "createdAt": "2026-07-01T15:21:54.000Z",
    "updatedAt": "2026-07-01T15:21:54.000Z"
  }
}
```

### Error Responses

#### 400 Bad Request (Validation Failure)
Returned when input payload requirements are not met.
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "-50",
      "msg": "Amount must be greater then 0",
      "path": "amount",
      "location": "body"
    }
  ]
}
```

---

## 2. Fetch Orders List

Returns all orders matching the optional status filter query, sorted by creation date descending.

- **Method**: `GET`
- **URL**: `/api/orders`
- **Query Parameters**:
  - `status` (String, optional): Filters results by order status. Supported values: `PLACED`, `PROCESSING`, `READY_TO_SHIP`.

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Orders fetched successfully",
  "count": 2,
  "data": [
    {
      "_id": "64bcde824b21d5a71a069f23",
      "orderId": "ORD000001",
      "customerName": "John Doe",
      "phone": "+15551234567",
      "productName": "Ergonomic Office Chair",
      "amount": 299.99,
      "paymentStatus": "PAID",
      "status": "PLACED",
      "createdAt": "2026-07-01T15:21:54.000Z"
    }
  ]
}
```

### Error Responses

#### 400 Bad Request (Invalid Status Filter)
Returned if the `status` query parameter value is not in `[PLACED, PROCESSING, READY_TO_SHIP]`.
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "type": "field",
      "value": "DELIVERED",
      "msg": "Invalid order status",
      "path": "status",
      "location": "query"
    }
  ]
}
```

---

## 3. Trigger Scheduler Engine

Runs the automated job to process orders and update statuses. Orders with status `PLACED` that have remained unchanged for at least 10 minutes are advanced to `PROCESSING`.

- **Method**: `POST`
- **URL**: `/api/scheduler/run`
- **Headers**:
  - `x-scheduler-secret: <SECRET_KEY>` (Required secret authorization key)

### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Scheduler executed successfully",
  "data": {
    "totalOrders": 1,
    "successCount": 1,
    "failedCount": 0
  }
}
```

### Error Responses

#### 401 Unauthorized (Missing Secret)
Returned if the `x-scheduler-secret` header is missing.
```json
{
  "success": false,
  "message": "Scheduler secret is missing"
}
```

#### 401 Unauthorized (Incorrect Secret)
Returned if the header secret key does not match the server's configured environment key.
```json
{
  "success": false,
  "message": "Invalid scheduler secret"
}
```

#### 500 Internal Server Error (Database/System Fault)
Returned if execution runs into unexpected server faults.
```json
{
  "success": false,
  "message": "Error message explanation here"
}
```
