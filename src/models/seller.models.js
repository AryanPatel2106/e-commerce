import mongoose, { Schema } from "mongoose";
import {
    selletProfileVerificationStatusEnum,
    availableSelletProfileVerificationStatus
} from "../utils/constants.js";

const sellerSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sellerType: {
        type: String,
        enum: ["individual", "business", "corporate"],
        required: true,
        trim: true
    },
    businessName: {
        type: String,
        required: true,
        trim: true
    },
    businessRegistrationNumber: {
        type: String,
        trim: true,
        required: function () {
            return this.sellerType !== "individual";
        }
    },
    businessRegistrationProof: {
        type: String,
        trim: true,
        required: function () {
            return this.sellerType !== "individual";
        }
    },
    panNumber: {
        type: String,
        required: true,
        trim: true
    },
    gstNumber: {
        type: String,
        required: true,
        trim: true
    },
    governmentIssuedIdType: {
        type: String,
        enum: ["passport", "aadhaar", "voter_id"],
        required: true,
        trim: true
    },
    governmentIssuedIdNumber: {
        type: String,
        required: true,
        trim: true
    },
    governmentIssuedIdProof: {
        type: String,
        required: true,
        trim: true
    },
    proofOfAddressType: {
        type: String,
        enum: ["utility_bill", "lease_agreement"],
        required: true,
        trim: true
    },
    proofOfAddressDocument: {
        type: String,
        required: true,
        trim: true
    },
    proofOfAddressDate: {
        type: Date
    },
    internationallyChargeableCreditCardBrand: {
        type: String,
        trim: true
    },
    internationallyChargeableCreditCardLast4: {
        type: String,
        trim: true
    },
    internationallyChargeableCreditCardToken: {
        type: String,
        trim: true
    },
    upiId: {
        type: String,
        trim: true,
        required: true
    },
    bankAccountHolderName: {
        type: String,
        required: true,
        trim: true
    },
    bankAccountNumber: {
        type: String,
        required: true,
        trim: true
    },
    bankIfscCode: {
        type: String,
        required: true,
        trim: true
    },
    bankName: {
        type: String,
        required: true,
        trim: true
    },
    bankBranch: {
        type: String,
        trim: true
    },
    businessAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    },
    businessPhoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    businessEmail: {
        type: String,
        required: true,
        trim: true
    },
    profileVerificationStatus: {
        type: String,
        enum: availableSelletProfileVerificationStatus,
        default: selletProfileVerificationStatusEnum.PENDING
    }
}, { timestamps: true });

export const Seller = mongoose.model("Seller", sellerSchema);