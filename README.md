### Health Check 

- `GET /api/v1/healthcheck`

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/verify-otp`
- `POST /api/v1/auth/resend-otp`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password/:resetToken`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/current-user`

### address

- `GET /api/v1/addresses`
- `POST /api/v1/addresses`
- `DELETE /api/v1/addresses/:addressId`
- `PUT /api/v1/addresses/:addressId`

### seller

- `POST /api/v1/seller/register`

### admin

- `GET /api/v1/admin/get-all-sellers`
- `GET /api/v1/admin/get-pending-sellers`
- `GET /api/v1/admin/:sellerId`
- `PUT /api/v1/admin/:sellerId/approve`
- `PUT /api/v1/admin/:sellerId/reject`