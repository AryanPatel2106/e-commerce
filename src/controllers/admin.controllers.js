import { User } from "../models/user.models.js"
import { Seller } from "../models/seller.models.js"
import { Address } from "../models/address.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { selletProfileVerificationStatusEnum } from "../utils/constants.js"
import mongoose from "mongoose"

const getAllSellers = asyncHandler(async (req, res) => {
    const sellers = await Seller.find().populate("userId").populate("businessAddress")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                sellers,
                "Sellers fetched successfully"
            )
        )
})

const getPendingSellers = asyncHandler(async (req, res) => {
    const pendingSellers = await Seller.find({ profileVerificationStatus: "pending" })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                pendingSellers,
                "Pending sellers fetched successfully"
            )
        )
})

const getSellerById = asyncHandler(async (req, res) => {
    const { sellerId } = req.params

    const seller = await Seller.findById(sellerId).populate("userId").populate("businessAddress")

    if (!seller) {
        throw new ApiError(404, "Seller not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                seller,
                "Seller fetched successfully"
            )
        )
})

const approveSeller = asyncHandler(async (req, res) => {
    const { sellerId } = req.params

    const seller = await Seller.findById(sellerId)

    if (!seller) {
        throw new ApiError(404, "Seller not found")
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    seller.profileVerificationStatus = selletProfileVerificationStatusEnum.VERIFIED

    await seller.save()

    User.findByIdAndUpdate(seller.userId, { $addToSet: { role: "seller" } })

    session.commitTransaction();
    session.endSession();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                seller,
                "Seller approved successfully"
            )
        )
})

const rejectSeller = asyncHandler(async (req, res) => {
    const { sellerId } = req.params

    const seller = await Seller.findById(sellerId)

    if (!seller) {
        throw new ApiError(404, "Seller not found")
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    seller.profileVerificationStatus = selletProfileVerificationStatusEnum.REJECTED

    await seller.save()

    const businessAddressId = seller.businessAddress

    if (businessAddressId) {
        await Address.findByIdAndDelete(businessAddressId)
    }

    session.commitTransaction();
    session.endSession();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                seller,
                "Seller rejected successfully"
            )
        )
})

export {
    getAllSellers,
    getPendingSellers,
    getSellerById,
    approveSeller,
    rejectSeller
}