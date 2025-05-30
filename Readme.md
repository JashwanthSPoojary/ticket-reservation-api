# Railway Ticket Reservation API - Assignment Submission

## Implementation Overview

I built this solution with:
- **Node.js + TypeScript** for type safety and modern JS features
- **Prisma** as the ORM for robust database operations
- **PostgreSQL** for relational data storage
- **Zod** for input validation
- **Docker** for containerized deployment

Key features implemented:
- Complete booking lifecycle (book/cancel/view)
- Seat allocation with priority rules
- RAC and waiting list management
- Atomic transactions for data consistency
- Proper error handling and validation

## One-Step Setup (Recommended)

```bash
# Clone and run with Docker (includes automatic DB setup)
git clone https://github.com/JashwanthSPoojary/ticket-reservation-api.git
cd ticket-reservation-api
docker-compose up -d
```

## Verification Steps

### 1. Check Initial Availability
```bash
curl http://localhost:3000/api/v1/tickets/available
```
*Expected Response:*
```json
{
  "confirmed": 63,
  "rac": 18,
  "waiting": 10
}
```

### 2. Test Ticket Booking
```bash
curl -X POST http://localhost:3000/api/v1/tickets/book \
-H "Content-Type: application/json" \
-d '{
  "passengers": [
    {"name": "Test Passenger", "age": 30, "gender": "MALE"}
  ]
}'
```

### 3. Verify Booked Tickets
```bash
curl http://localhost:3000/api/v1/tickets/booked
```
*Expected Response:*
```json
[
  {
    "id": 1,
    "pnrNumber": "PNRABC123",
    "bookingStatus": "CONFIRMED",
    "passengers": [
      {
        "id": 1,
        "name": "Test Passenger",
        "age": 30,
        "gender": "MALE",
        "isChild": false
      }
    ],
    "createdAt": "2023-05-15T10:00:00.000Z",
    "updatedAt": "2023-05-15T10:00:00.000Z"
  }
]
```

### 4. Verify Updated Availability
```bash
curl http://localhost:3000/api/v1/tickets/available
```
*Expected Response (counts decreased by 1):*
```json
{
  "confirmed": 62,
  "rac": 18,
  "waiting": 10
}
```

### 5. Test Cancellation Flow
```bash
# Book first
TICKET_ID=$(curl -s -X POST http://localhost:3000/api/v1/tickets/book \
-H "Content-Type: application/json" \
-d '{"passengers": [{"name": "To Cancel", "age": 35, "gender": "FEMALE"}]}' | jq -r '.data.id')

# Then cancel
curl -X POST http://localhost:3000/api/v1/tickets/cancel/$TICKET_ID
```

### 6. Verify Post-Cancellation State
```bash
# Check booked tickets (should be empty or reduced)
curl http://localhost:3000/api/v1/tickets/booked

# Check availability (should increase back)
curl http://localhost:3000/api/v1/tickets/available
```

### 7. Test Edge Cases
```bash
# Invalid data
curl -X POST http://localhost:3000/api/v1/tickets/book \
-H "Content-Type: application/json" \
-d '{"passengers": [{"age": 30}]}'

# No tickets available (after booking all)
for i in {1..100}; do
  curl -X POST http://localhost:3000/api/v1/tickets/book \
  -H "Content-Type: application/json" \
  -d '{"passengers": [{"name": "Passenger '$i'", "age": 25, "gender": "MALE"}]}'
done
```

## Implementation Highlights

1. **Clean Architecture**:
   - Separated controllers, services, and repositories
   - Used DTOs with Zod validation
   - Domain-driven design approach

2. **Database Design**:
   - Prisma schema modeling all constraints
   - Transactional operations for data integrity
   - Automatic seat availability tracking

3. **Business Logic**:
   - Priority seating for seniors/ladies with children
   - RAC ticket handling (2 passengers per side-lower berth)
   - Waiting list promotion on cancellation

4. **Production-Ready**:
   - Dockerized with health checks
   - Proper error handling
   - Input validation

## Alternative Local Setup (Without Docker)

```bash
# Requires Node.js 18+ and PostgreSQL
npm install
npx prisma migrate dev
npm run build
npm run start
```
