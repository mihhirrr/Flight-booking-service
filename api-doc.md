# Booking Service API Documentation

## Overview
This is the Booking Service API documentation. The service handles flight booking creation, payment processing, and booking cancellation.

**Base URL:** `/api/bookings`

---

## Table of Contents
1. [Health Check](#1-health-check)
2. [Create Booking](#2-create-booking)
3. [Make Payment](#3-make-payment)
4. [Cancel Booking](#4-cancel-booking)
5. [Data Models](#data-models)
6. [Error Responses](#error-responses)
7. [Status Codes](#status-codes)

---

## 1. Health Check

Check if the booking route is functional.

### Endpoint
```
GET /api/bookings/health
```

### Request
- **Method:** `GET`
- **Headers:** None required
- **Body:** None

### Response
**Success (200 OK)**
```json
{
  "message": "Booking route is functional."
}
```

### Example
```bash
curl -X GET http://localhost:PORT/api/bookings/health
```

---

## 2. Create Booking

Create a new booking for a flight with selected seats.

### Endpoint
```
POST /api/bookings/:flightId
```

### Request
- **Method:** `POST`
- **Path Parameters:**
  - `flightId` (integer, required): The ID of the flight to book
- **Query Parameters:**
  - `seats` (string, required): Seat selection in format `Economy-Business-FirstClass`
    - Format: `"E-B-F"` where E, B, F are numbers
    - Example: `"2-1-0"` means 2 Economy, 1 Business, 0 FirstClass seats
- **Headers:**
  - `Content-Type: application/json`
- **Body:**
```json
{
  "userId": 123
}
```

### Request Body Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | integer | Yes | The ID of the user making the booking |

### Validation
- `userId` must be provided in request body
- `flightId` must be provided in URL path
- `seats` query parameter must be provided

### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "Request fulfilled",
  "data": {
    "id": 1,
    "userId": 123,
    "flightId": 456,
    "status": "Initiated",
    "totalBookedSeats": 3,
    "bookingCharges": 15000,
    "Economy": 2,
    "Business": 1,
    "FirstClass": 0,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "error": {}
}
```

**Error (400 Bad Request)**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "User ID, Flight ID or Seat Selection not provided!"
  }
}
```

**Error (400 Bad Request) - Insufficient Seats**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Not enough Seats",
    "StatusCode": 400
  }
}
```

**Error (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Error message here",
    "StatusCode": 500
  }
}
```

### Business Logic
- Validates seat availability against airplane capacity
- Calculates booking charges based on class fares
- Decrements seat count in flight service
- Creates booking with status `Initiated`
- Booking expires after 10 minutes if payment is not made

### Example
```bash
curl -X POST "http://localhost:PORT/api/bookings/456?seats=2-1-0" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 123
  }'
```

---

## 3. Make Payment

Process payment for an existing booking to confirm it.

### Endpoint
```
POST /api/bookings/payments
```

### Request
- **Method:** `POST`
- **Headers:**
  - `Content-Type: application/json`
  - `x-idempotency-key` (string, required): Unique key to prevent duplicate payments
- **Body:**
```json
{
  "bookingID": 1,
  "seats": ["1A", "1B", "2C"]
}
```

### Request Body Schema
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| bookingID | integer | Yes | The ID of the booking to pay for |
| seats | array of strings | Yes | Array of seat identifiers to assign to the booking |

### Validation
- `bookingID` must be provided in request body
- `x-idempotency-key` header must be provided
- Idempotency key must not have been used for a successful payment before

### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "Request fulfilled",
  "data": true,
  "error": {}
}
```

**Error (400 Bad Request) - Missing Booking ID**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": "Booking ID not provided!"
}
```

**Error (400 Bad Request) - Missing Idempotency Key**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Idempotency key missing!"
  }
}
```

**Error (400 Bad Request) - Duplicate Payment**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Cannot retry a successful payment!"
  }
}
```

**Error (400 Bad Request) - Already Confirmed**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Booking already confirmed!",
    "StatusCode": 400
  }
}
```

**Error (410 Gone) - Booking Expired/Cancelled**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Booking already canceled or Booking is expired! Please create a new itenery.",
    "StatusCode": 410
  }
}
```

**Error (410 Gone) - Payment Timeout**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Booking Expired! Please create a new itenery.",
    "StatusCode": 410
  }
}
```

**Error (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Error message here",
    "StatusCode": 500
  }
}
```

### Business Logic
- Validates booking exists and is in `Initiated` status
- Checks if booking has expired (10 minutes from creation)
- If expired, automatically cancels the booking
- Updates booking status to `Booked`
- Updates seat status in flight service with booking ID
- Implements idempotency to prevent duplicate payments

### Payment Expiration
- Bookings expire 10 minutes after creation if payment is not completed
- Expired bookings cannot be paid for

### Example
```bash
curl -X POST http://localhost:PORT/api/bookings/payments \
  -H "Content-Type: application/json" \
  -H "x-idempotency-key: unique-payment-key-12345" \
  -d '{
    "bookingID": 1,
    "seats": ["1A", "1B", "2C"]
  }'
```

---

## 4. Cancel Booking

Cancel an existing booking.

### Endpoint
```
PATCH /api/bookings/:bookingId/cancel
```

### Request
- **Method:** `PATCH`
- **Path Parameters:**
  - `bookingId` (integer, required): The ID of the booking to cancel
- **Headers:**
  - `Content-Type: application/json`
- **Body:** None

### Response
**Success (200 OK)**
```json
{
  "success": true,
  "message": "Request fulfilled",
  "data": "Booking cancelled successfully!",
  "error": {}
}
```

**Error (410 Gone) - Already Expired**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Booking already Expired!",
    "StatusCode": 410
  }
}
```

**Error (500 Internal Server Error)**
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Booking not found!",
    "StatusCode": 500
  }
}
```

### Business Logic
- Updates booking status to `Canceled`
- Reverts seat capacity in flight service
- Note: Refund logic is planned but not yet implemented

### Example
```bash
curl -X PATCH http://localhost:PORT/api/bookings/1/cancel \
  -H "Content-Type: application/json"
```

---

## Data Models

### Booking Model

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | integer | Auto | Unique booking identifier |
| userId | integer | Yes | ID of the user who made the booking |
| flightId | integer | Yes | ID of the flight being booked |
| status | enum | Yes | Booking status (see Status Enum below) |
| totalBookedSeats | integer | Yes | Total number of seats booked |
| bookingCharges | integer | Yes | Total cost of the booking |
| Economy | integer | Yes | Number of Economy class seats (default: 0) |
| Business | integer | Yes | Number of Business class seats (default: 0) |
| FirstClass | integer | Yes | Number of First Class seats (default: 0) |
| createdAt | datetime | Auto | Booking creation timestamp |
| updatedAt | datetime | Auto | Last update timestamp |

### Booking Status Enum

| Value | Description |
|-------|-------------|
| `Initiated` | Booking created but payment not yet made |
| `Booked` | Payment successful, booking confirmed |
| `Canceled` | Booking cancelled by user |
| `Expired` | Booking expired due to payment timeout (10 minutes) |
| `Failed` | Booking failed (reserved for future use) |

---

## Error Responses

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Unable to fulfill request",
  "data": {},
  "error": {
    "message": "Error description",
    "StatusCode": 400
  }
}
```

### Standard Success Response Format
```json
{
  "success": true,
  "message": "Request fulfilled",
  "data": {},
  "error": {}
}
```

---

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid input or validation error |
| 410 | Gone - Resource expired or no longer available |
| 500 | Internal Server Error - Server-side error |
| 502 | Bad Gateway - External service error |

---

## Notes

### Idempotency
The payment endpoint implements idempotency using the `x-idempotency-key` header. Once a payment is successfully processed with a specific key, subsequent requests with the same key will be rejected.

### Booking Expiration
- Bookings are automatically expired if payment is not completed within 10 minutes
- Expired bookings cannot be paid for
- A cron job runs periodically to expire old bookings

### External Service Dependencies
- **Flight Service**: Used to fetch flight details, airplane capacity, and update seat counts
- **Seat Service**: Used to update seat status and assign booking IDs to seats

### Transaction Management
All booking operations use database transactions to ensure data consistency. If any step fails, the entire operation is rolled back.

---

## API Versioning

Currently, all routes are under `/api/bookings` (v1). Future versions may be added under `/api/v2/bookings`, etc.

---

## Contact & Support

For issues or questions regarding the Booking Service API, please contact the development team.


