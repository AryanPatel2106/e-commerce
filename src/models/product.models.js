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
    rating: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Customer",
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
        }
    ],
    totalRating: {
        type: Number,
        default: 0
    },
    numRatings: {
        type: Number,
        default: 0
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