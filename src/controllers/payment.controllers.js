import razorpay from "../utils/razorpay.js";

import { Product } from "../models/product.models.js";
import { Seller } from "../models/seller.models.js";
import { Address } from "../models/address.models.js";

import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { Order } from "../models/order.models.js";

import crypto from "crypto";

const createOrder = asyncHandler(async (req, res) => {
  const { productId, quantity, shippingAddressId } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const seller = await Seller.findById(product.seller);

  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  const address = await Address.findById(shippingAddressId);

  if (!address) {
    throw new ApiError(404, "Shipping address not found");
  }

  const qty = Number(quantity);

  if (qty <= 0) {
    throw new ApiError(400, "Invalid quantity");
  }

  const availableStock = Number(product.quantity);

  if (qty > availableStock) {
    throw new ApiError(400, "Not enough stock available");
  }

  const price = Number(product.price.replace(/[^\d]/g, ""));

  const shippingCharge = 50;

  const total = price * qty + shippingCharge;

  const amount = total * 100;

  try {
    console.log("Amount:", amount);

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    console.log(razorpayOrder);

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          orderId: razorpayOrder.id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
        },
        "Order created successfully",
      ),
    );
  } catch (err) {
    console.dir(err, { depth: null });

    return res.status(500).json(err);
  }
});

const verifyPayment = asyncHandler(async (req, res) => {
  const {
    productId,
    quantity,
    shippingAddressId,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = req.body;

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Payment verification failed");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const seller = await Seller.findById(product.seller);

  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  const shippingAddress = await Address.findById(shippingAddressId);

  if (!shippingAddress) {
    throw new ApiError(404, "Shipping address not found");
  }

  const qty = Number(quantity);

  const price = Number(product.price.replace(/[^\d]/g, ""));

  const totalPrice = price * qty + 50;

  const order = new Order({
    userId: req.user._id,

    productId,

    sellerId: seller._id,

    quantity: qty,

    totalPrice,

    shippingAddress: shippingAddressId,

    razorpayOrderId: razorpay_order_id,

    razorpayPaymentId: razorpay_payment_id,

    paymentStatus: "Paid",

    paymentMethod: "Razorpay",
  });

  await order.save();

  product.quantity = String(Number(product.quantity) - qty);

  await product.save();

  return res.status(201).json(
    new ApiResponse(
      201,

      order,

      "Order placed successfully",
    ),
  );
});

export { createOrder, verifyPayment };
