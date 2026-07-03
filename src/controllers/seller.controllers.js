import { Seller } from "../models/seller.models.js"
import { Address } from "../models/address.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { AddressTypesEnum } from "../utils/constants.js"
import mongoose from "mongoose"

const registerSeller = asyncHandler(async (req, res) => {
    const user = req.user;

    if(!user) {
        throw new ApiError(404, "Unauthorized user. Please login to continue.");
    }

    const existingSeller = await Seller.findOne({ user: user._id, profileVerificationStatus: "approved" });

    if(existingSeller) {
        throw new ApiError(400, "Seller profile already exists for this user.");
    }

    const requentAlreadyPendingSeller = await Seller.findOne({ user: user._id, profileVerificationStatus: "pending" });

    if(requentAlreadyPendingSeller) {
        throw new ApiError(400, "Seller profile verification is already pending for this user.");
    }

    const {
		sellerType,
		businessName,
		businessRegistrationNumber,
		businessRegistrationProof,
		panNumber,
		gstNumber,
		governmentIssuedIdType,
		governmentIssuedIdNumber,
		governmentIssuedIdProof,
		proofOfAddressType,
		proofOfAddressDocument,
		proofOfAddressDate,
		internationallyChargeableCreditCardBrand,
		internationallyChargeableCreditCardLast4,
		internationallyChargeableCreditCardToken,
		bankAccountHolderName,
		bankAccountNumber,
		bankIfscCode,
		bankName,
		bankBranch,
		businessPhoneNumber,
		businessEmail,
		country,
		houseNumber,
		street,
		landmark,
		pinCode,
		city,
		state
	} = req.body

    const businessAddress = {
		country,
		houseNumber,
		street,
		landmark,
		pinCode,
		city,
		state
	}

    const requiredAddressFields = ["country", "houseNumber", "street", "pinCode", "city", "state"]
	const missingAddressField = requiredAddressFields.find((field) => !businessAddress?.[field])

	if (missingAddressField) {
		throw new ApiError(400, `${missingAddressField} is required in businessAddress`)
	}

    const session = await mongoose.startSession();

    session.startTransaction();

    const address = new Address({
        user: user._id,
        type: AddressTypesEnum.BUSINESS,
        ...businessAddress
    })

    await address.save({ session })

    const seller = new Seller({
        userId: user._id,
        sellerType,
		businessName,
		businessRegistrationNumber,
		businessRegistrationProof,
		panNumber,
		gstNumber,
		governmentIssuedIdType,
		governmentIssuedIdNumber,
		governmentIssuedIdProof,
		proofOfAddressType,
		proofOfAddressDocument,
		proofOfAddressDate,
		internationallyChargeableCreditCardBrand,
		internationallyChargeableCreditCardLast4,
		internationallyChargeableCreditCardToken,
		bankAccountHolderName,
		bankAccountNumber,
		bankIfscCode,
		bankName,
		bankBranch,
		businessPhoneNumber,
		businessEmail,
		businessAddress: address._id
    })

    await seller.save({ session })

    await session.commitTransaction();
    await session.endSession();
    
    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                seller,
                "Business Account Requested successfully. Your seller profile is under review."
            )
        )
})

export { registerSeller }