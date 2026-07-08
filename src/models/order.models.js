import mongoose, { Schema } from "mongoose"

const orderSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    shippingAddress: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    }
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)