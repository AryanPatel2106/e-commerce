import mongoose, { Schema } from "mongoose"
import { OrderStatusEnum,availableOrderStatus } from "../utils/constants.js"

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
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
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
        enum: availableOrderStatus,
        default: OrderStatusEnum.PENDING
    },
    shippingAddress: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    }
}, {timestamps: true})

export const Order = mongoose.model("Order", orderSchema)