
# Disposable Email Backend Service

This is a standalone backend service for handling disposable email addresses. It provides SMTP, IMAP, and API functionality for the DisposaMail frontend application.

## Features

- SMTP server for receiving emails
- IMAP client for fetching emails from an existing mailbox
- API endpoints for accessing and managing emails
- Integration with Redis for caching and fast access
- Integration with PostgreSQL for persistent storage (compatible with Supabase)

## Requirements

- Node.js 18 or higher
- Redis server
- PostgreSQL database (compatible with Supabase)
- For the IMAP client: Access to an IMAP mailbox

## Setup

1. Clone this repository
2. Copy `.env.example` to `.env` and update the configuration values
3. Install dependencies: `npm install`
4. Start the service: `npm start`

For development, you can use `npm run dev` to start the service with hot-reloading.

## Environment Variables

Configure the service by setting these environment variables in your `.env` file:

### Server Settings
- `PORT`: API server port (default: 3000)
- `CORS_ORIGIN`: Frontend origin for CORS (default: *)

### SMTP Server Settings
- `SMTP_HOST`: Host for the SMTP server (default: 0.0.0.0)
- `SMTP_PORT`: Port for the SMTP server (default: 2525)
- `SMTP_AUTH_USER`: Username for SMTP authentication
- `SMTP_AUTH_PASS`: Password for SMTP authentication

### IMAP Client Settings
- `IMAP_HOST`: Host of the IMAP server to connect to
- `IMAP_PORT`: Port of the IMAP server (default: 993)
- `IMAP_USER`: Username for IMAP authentication
- `IMAP_PASSWORD`: Password for IMAP authentication
- `IMAP_TLS`: Whether to use TLS (default: true)

### Redis Configuration
- `REDIS_URL`: Redis connection URL (default: redis://localhost:6379)

### PostgreSQL Configuration
- `POSTGRES_HOST`: PostgreSQL host (default: localhost)
- `POSTGRES_PORT`: PostgreSQL port (default: 5432)
- `POSTGRES_DB`: PostgreSQL database name (default: postgres)
- `POSTGRES_USER`: PostgreSQL username (default: postgres)
- `POSTGRES_PASSWORD`: PostgreSQL password (default: postgres)

## API Endpoints

### GET /api/emails/:email
Get all emails for a specific email address.

### PUT /api/emails/:id/read
Mark an email as read.

### POST /api/emails/reply
Send a reply to an email.

#### Request Body
```json
{
  "fromAddress": "user@disposable-domain.com",
  "toAddress": "recipient@example.com",
  "subject": "Re: Subject",
  "text": "Plain text content",
  "html": "<p>HTML content</p>"
}
```

## Integration with Frontend

Update your frontend `emailService.ts` to connect to this backend service instead of using mock data or edge functions.
