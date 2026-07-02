import { Address } from "../models/address.models.js";
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"

const addNewAddress = asyncHandler(async (req, res) => {
    const { country, houseNumber, street, landmark, pinCode, city, state } = req.body

    const address = new Address({
        user: req.user._id,
        country,
        houseNumber,
        street,
        landmark,
        pinCode,
        city,
        state
    })

    await address.save()

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                address,
                "Address added successfully"
            )
        )
})

const getAllAddresses = asyncHandler(async (req, res) => {
    const addresses = await Address.find({ user: req.user._id })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                addresses,
                "Addresses fetched successfully"
            )
        )
})

const deleteAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params

    const address = await Address.findByIdAndDelete(addressId)

    if (!address) {
        throw new ApiError(404, "Address not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Address deleted successfully"
            )
        )
})

const updateAddress = asyncHandler(async (req, res) => {
    const { addressId } = req.params

    const updatedAddress = await Address.findByIdAndUpdate(
        addressId,
        req.body,
        { new: true, runValidators: true }
    )

    if (!updatedAddress) {
        throw new ApiError(404, "Address not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedAddress,
                "Address updated successfully"
            )
        )
})

export {
    addNewAddress,
    getAllAddresses,
    deleteAddress,
    updateAddress
}