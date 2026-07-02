import mongoose, {Schema} from "mongoose";

const addressSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    country: {
        type: String,
        required: true
    },
    houseNumber: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    landmark: {
        type: String
    },
    pinCode: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    }
}, {timestamps: true});

export const Address = mongoose.model("Address", addressSchema);