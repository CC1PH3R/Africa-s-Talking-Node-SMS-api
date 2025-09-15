# AfricaT Sandbox

A sandbox application for testing Africa's Talking SMS API integration.

## Overview

This project provides a simple Express.js server that wraps the Africa's Talking SMS API, allowing you to send SMS messages through HTTP endpoints and track their delivery status using a PostgreSQL database.

## Prerequisites

- Node.js
- npm
- PostgreSQL
- ngrok (for testing webhooks)

## Installation

1. Clone the repository
2. Install dependencies:
```sh
npm install
```
3. Create a `.env` file with your Africa's Talking credentials:
```sh
AT_USERNAME=sandbox
AT_API_KEY=your_api_key
AT_SENDER_ID=your_sender_id
PORT=4000
DATABASE_URL="postgresql://user:password@localhost:5432/your_database"
```
4. Initialize the database:
```sh
npx prisma generate
npx prisma db push
```

## Database Schema

The application uses Prisma ORM with PostgreSQL to store message data:

```prisma
model Message {
  id          String   @id        // AT messageId
  phoneNumber String
  text        String
  status      String   @default("Sent")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  retries     Int      @default(0)
}
```
## Development, Ngrok Setup and Callback Configuration

1. Start your Express server:
```sh
npm run dev
```

### Starting Ngrok
2. In a new terminal, start ngrok:
```sh
ngrok http 4000
```

3. Copy the generated ngrok URL (e.g., https://abcdefgh.ngrok-free.app)

### Testing Ngrok Connection
Test if ngrok tunnel is working by visiting:
```
https://[your-ngrok-url]/test
```
You should receive: `{ "message": "Server is reachable via ngrok" }`

### Configuring Callback URL
1. Go to Africa's Talking Dashboard
2. Navigate to SMS -> SMS Callback URLs
3. Update the Delivery Reports callback URL with:
```
https://[your-ngrok-url]/callback
```

> **Important**: The callback URL needs to be updated in Africa's Talking Dashboard every time you restart ngrok, as it generates a new URL each time.

### Testing Flow
1. Send SMS through the `/sms/send` endpoint
2. Message delivery status will be received at `/callback`
3. Status updates are stored in the database and can be viewed using Prisma Studio

To view database records:
```sh
npx prisma studio
```

## API Endpoints

### Send SMS
- **URL:** `/sms/send`
- **Method:** POST
- **Body:**
```json
{
    "to": "+254712345678",
    "message": "Your message"
}
```
#### Testing with cURL
```sh
curl -X POST http://localhost:4000/sms/send \
     -H "Content-Type: application/json" \
     -d '{
           "to": "+254712345678",
           "message": "Hello from AfricaT Sandbox"
         }'
```

### Delivery Reports
- **URL:** `/callback`
- **Method:** POST
- Handles SMS delivery reports from Africa's Talking
- Updates message status in database

### Test Endpoint
- **URL:** `/test`
- **Method:** GET
- Used to verify ngrok tunnel connectivity

## Project Structure

- `index.js` - Main application file with Express server and routes
- `atClient.js` - Africa's Talking SDK wrapper
- `eventBus.js` - Event handling system for delivery reports
- `prisma/schema.prisma` - Database schema definition
- `.env` - Environment configuration

## Dependencies

- africastalking - Africa's Talking SDK
- express - Web framework
- cors - Cross-origin resource sharing
- @prisma/client - Database ORM
- prisma - Database migration and management
- dotenv - Environment variable management
- nodemon (dev) - Development auto-reload