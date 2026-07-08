import mongoose, { Schema } from "mongoose"

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    images: {
        type: [{
            url: String,
            altText: String,
            s3Key: String
        }],
        required: true
    },
    price: {
        type: String,   
        required: true
    },
    quantity: {
        type: String,   
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    seller: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    }
}, {timestamps: true})

export const Product = mongoose.model("Product", productSchema)