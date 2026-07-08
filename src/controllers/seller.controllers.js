import { Seller } from "../models/seller.models.js"
import { Address } from "../models/address.models.js"
import { Product } from "../models/product.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { AddressTypesEnum } from "../utils/constants.js"
import { uploadToS3, deleteFromS3, } from "../utils/s3.js"
import mongoose from "mongoose"
import QRCode from "qrcode";

const registerSeller = asyncHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "Unauthorized user. Please login to continue.");
	}

	const existingSeller = await Seller.findOne({ userId: user._id, profileVerificationStatus: "approved" });

	if (existingSeller) {
		throw new ApiError(400, "Seller profile already exists for this user.");
	}

	const requentAlreadyPendingSeller = await Seller.findOne({ userId: user._id, profileVerificationStatus: "pending" });

	if (requentAlreadyPendingSeller) {
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
		upiId,
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
		upiId,
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
const getSellerProfile = asyncHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "Unauthorized user. Please login to continue.");
	}

	const seller = await Seller.findOne({ userId: user._id }).populate("businessAddress");

	if (!seller) {
		throw new ApiError(404, "Seller profile not found.");
	}

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				seller,
				"Seller profile fetched successfully."
			)
		);
})

const addProduct = asyncHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "Unauthorized user. Please login to continue.");
	}

	const seller = await Seller.findOne({ userId: user._id, profileVerificationStatus: "verified" });

	if (!seller) {
		throw new ApiError(403, "You are not authorized to add products. Please complete the seller verification process.");
	}

	let { name, description, price, quantity, category } = req.body;
	price = "Rs. " + price;

	const images = req.files || [];
	const attachments = [];

	for (const image of images) {
		const { url, key } = await uploadToS3(image.buffer, image.originalname, image.mimetype);

		attachments.push({
			url: url,
			altText: image.originalname,
			s3Key: key
		});
	}

	const product = new Product({
		name,
		description,
		images: attachments,
		price,
		quantity,
		category,
		seller: seller._id
	});

	await product.save();

	return res
		.status(201)
		.json(
			new ApiResponse(
				201,
				product,
				"Product added successfully."
			)
		);
})

const getAllProducts = asyncHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "Unauthorized user. Please login to continue.");
	}

	const seller = await Seller.findOne({ userId: user._id, profileVerificationStatus: "verified" });

	if (!seller) {
		throw new ApiError(403, "You are not authorized to view products. Please complete the seller verification process.");
	}

	const products = await Product.find({ seller: seller._id });

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				products,
				"Products fetched successfully."
			)
		);
})

const getProductById = asyncHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "Unauthorized user. Please login to continue.");
	}

	const seller = await Seller.findOne({ userId: user._id, profileVerificationStatus: "verified" });

	if (!seller) {
		throw new ApiError(403, "You are not authorized to view products. Please complete the seller verification process.");
	}

	const { productId } = req.params;

	const product = await Product.findById(productId);

	if (!product) {
		throw new ApiError(404, "Product not found.");
	}

	const upiId = seller.upiId;

	const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(seller.businessName)}&am=${product.price}&cu=INR`;

	const qrImageDataUrl = await QRCode.toDataURL(upiUrl);

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{product, upiId: seller.upiId, upiUrl: upiUrl, qrImageDataUrl: qrImageDataUrl},
				"Product fetched successfully."
			)
		);
})

const updateProduct = asyncHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "Unauthorized user. Please login to continue.");
	}

	const { productId } = req.params;

	const product = await Product.findById(productId);

	if (!product) {
		throw new ApiError(404, "Product not found.");
	}

	const seller = await Seller.findOne({ userId: user._id, profileVerificationStatus: "verified" });

	if (!seller) {
		throw new ApiError(403, "You are not authorized to update products. Please complete the seller verification process.");
	}

	if (product.seller.toString() !== seller._id.toString()) {
		throw new ApiError(403, "You are not authorized to update this product.");
	}

	const session = await mongoose.startSession();
	session.startTransaction();

	const { name, description, price, quantity, category, deleteImages } = req.body;

	if (name) product.name = name;
	if (description) product.description = description;
	if (price) product.price = price;
	if (quantity) product.quantity = quantity;
	if (category) product.category = category;

	let imagesToDelete = [];

	if (deleteImages) {
		imagesToDelete =
			typeof deleteImages === "string"
				? JSON.parse(deleteImages)
				: deleteImages;
	}

	await product.save();

	if (imagesToDelete.length > 0) {
		for (const s3Key of imagesToDelete) {
			await deleteFromS3(s3Key);
		}

		product.images = product.images.filter(
			(image) => !imagesToDelete.includes(image.s3Key)
		);
	}

	const images = req.files || [];
	if (images.length > 0) {
		for (const image of images) {
			const { url, key } = await uploadToS3(image.buffer, image.originalname, image.mimetype);

			product.images.push({
				url,
				altText: image.originalname,
				s3Key: key,
			});
		}
	}

	await product.save({ session });

	await session.commitTransaction();
	await session.endSession();

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				product,
				"Product updated successfully."
			)
		);
})

const deleteProduct = asyncHandler(async (req, res) => {
	const user = req.user;

	if (!user) {
		throw new ApiError(404, "Unauthorized user. Please login to continue.");
	}

	const { productId } = req.params;

	const product = await Product.findById(productId);

	if (!product) {
		throw new ApiError(404, "Product not found.");
	}

	await Promise.all(
		product.images.map((image) => deleteFromS3(image.s3Key))
	);

	await product.deleteOne();

	return res
		.status(200)
		.json(
			new ApiResponse(
				200,
				{},
				"Product deleted successfully."
			)
		);
})

export { registerSeller, getSellerProfile, addProduct, getAllProducts, getProductById, updateProduct, deleteProduct }