# AfricaT Sandbox

A sandbox application for testing Africa's Talking SMS API integration.

## Overview

This project provides a simple Express.js server that wraps the Africa's Talking SMS API, allowing you to send SMS messages through HTTP endpoints.

## Prerequisites

- Node.js
- npm
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
```

## API Endpoints

### Send SMS
- **URL:** `/sms/send`
- **Method:** POST
- **Body:**
```json
{
    "to": "phone_number",
    "message": "Your message"
}
```

### Delivery Reports
- **URL:** `/callback`
- **Method:** POST
- Handles SMS delivery reports from Africa's Talking

### Test Endpoint
- **URL:** `/test`
- **Method:** GET
- Used to verify ngrok tunnel connectivity

## Development

Run the development server with auto-reload:

```sh
npm run dev
```

## Project Structure

- [index.js](index.js) - Main application file with Express server and routes
- [atClient.js](atClient.js) - Africa's Talking SDK wrapper
- [.env](.env) - Environment configuration
- [package.json](package.json) - Project configuration and dependencies

## Dependencies

- africastalking - Africa's Talking SDK
- express - Web framework
- cors - Cross-origin resource sharing
- body-parser - Request body parsing
- dotenv - Environment variable management
- nodemon (dev) - Development auto-reload