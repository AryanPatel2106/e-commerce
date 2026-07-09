# Ecommerce API

A Node.js + Express + MongoDB backend for an ecommerce platform with customer, seller, and admin workflows. The API supports authentication, OTP-based registration, optional 2FA, address management, seller onboarding, product management, order management, file uploads, AWS S3 storage, and AWS SES email delivery.

## Features

- JWT-based authentication and protected routes
- OTP verification during registration
- Optional 2FA setup and login verification
- Password reset flow through email
- Customer address management
- Seller registration, product CRUD, and order status updates
- Admin approval/rejection flow for sellers
- MongoDB persistence with Mongoose
- S3-backed attachment uploads
- SES-backed transactional emails

## Tech Stack

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Token
- Multer
- AWS S3
- AWS SES
- Express Validator

## Project Structure

```text
src/
	app.js                # Express app configuration
	index.js              # Server bootstrap and DB connection
	controllers/          # Route handlers
	db/                   # MongoDB connection
	middlewares/          # Auth, validation, upload helpers
	models/               # Mongoose schemas
	routes/               # API route definitions
	utils/                # Shared helpers
	validators/           # Request validation rules
public/                 # Static assets
```

## Prerequisites

- Node.js 18 or newer
- MongoDB database
- AWS account with S3 and SES configured

## Installation

1. Clone the repository.
2. Install dependencies.

```bash
npm install
```

3. Create a `.env` file in the project root.
4. Start the development server.

```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the values your app needs:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce

CLIENT_URL=http://localhost:5173
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_S3_BUCKET=your-s3-bucket-name
SES_FROM_EMAIL=noreply@example.com
```

### Notes

- `CLIENT_URL` is used in password-reset links and email templates.
- `CORS_ORIGIN` accepts a comma-separated list of allowed origins.
- `ACCESS_TOKEN_SECRET` is required for JWT verification.
- `AWS_S3_BUCKET`, `AWS_REGION`, and the AWS credentials are required for file uploads.

## Available Scripts

- `npm run dev` - start the app with Nodemon
- `npm start` - start the production server

## API Base URL

All routes are mounted under `/api/v1`.

## Health Check

- `GET /api/v1/healthcheck`

## Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/resend-otp`
- `POST /api/v1/auth/setup-2fa`
- `POST /api/v1/auth/verify-2fa`
- `POST /api/v1/auth/disable-2fa`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/verify-2fa-login`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password/:resetToken`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/current-user`

## Customer

- `GET /api/v1/customer`
- `POST /api/v1/customer`
- `DELETE /api/v1/customer/:addressId`
- `PUT /api/v1/customer/:addressId`
- `GET /api/v1/customer/products`
- `GET /api/v1/customer/products/:productId`
- `POST /api/v1/customer/products/:productId`
- `GET /api/v1/customer/orders`
- `GET /api/v1/customer/orders/:orderId`
- `PATCH /api/v1/customer/orders/:orderId`

## Seller

- `POST /api/v1/seller/register`
- `GET /api/v1/seller/profile`
- `GET /api/v1/seller/products`
- `POST /api/v1/seller/products`
- `GET /api/v1/seller/products/:productId`
- `PUT /api/v1/seller/products/:productId`
- `DELETE /api/v1/seller/products/:productId`
- `GET /api/v1/seller/orders`
- `GET /api/v1/seller/orders/:orderId`
- `PUT /api/v1/seller/orders/:orderId`

## Admin

- `GET /api/v1/admin/get-all-sellers`
- `GET /api/v1/admin/get-pending-sellers`
- `GET /api/v1/admin/:sellerId`
- `PUT /api/v1/admin/:sellerId/approve`
- `PUT /api/v1/admin/:sellerId/reject`

## Authentication Notes

- Most customer, seller, and admin routes require a valid JWT.
- Seller and admin routes have additional role-based checks.
- Multipart uploads use the `attachments` field.

## Health Response

The health check endpoint returns a simple `OK` payload so you can quickly confirm the API is running.

## Troubleshooting

- If the server exits immediately, verify `MONGO_URI` and the MongoDB connection.
- If login or protected routes fail, confirm the JWT secret and token expiry values.
- If email delivery fails, verify SES region, sender address, and sandbox restrictions.
- If uploads fail, confirm the S3 bucket name, region, and IAM permissions.

## License

ISC