import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();

// basic configuration
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// cors configuration
app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:5173',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Authorization', 'Content-Type'],
    })
)

// routes
import healthCheckRouter from "./routes/healthcheck.routes.js"
import authRouter from "./routes/auth.routes.js"
import addressRouter from "./routes/address.routes.js"
import sellerRouter from "./routes/seller.routes.js"
import adminRouter from "./routes/admin.routes.js"

app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/auth",authRouter);
app.use("/api/v1/addresses", addressRouter);
app.use("/api/v1/seller", sellerRouter);
app.use("/api/v1/admin", adminRouter);

export default app;