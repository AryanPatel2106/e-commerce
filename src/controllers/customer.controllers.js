import { Address } from "../models/address.models.js";
import { Product } from "../models/product.models.js";
import { Seller } from "../models/seller.models.js"
import { Order } from "../models/order.models.js";
import { Cart } from "../models/cart.models.js";
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import QRCode from "qrcode";
import {availableOrderStatus, OrderStatusEnum } from "../utils/constants.js"

// address controllers

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
    const addresses = await Address.find({ user: req.user._id, type: "customer" })

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

// product controllers

const getProducts = asyncHandler(async (req, res) => {
    const limit = Number(req.query.limit) || 30;
    const lastId = req.query.lastId;

    const filter = {};

    if (lastId) {
        filter._id = { $lt: lastId };
    }

    const products = await Product.find(filter)
        .select("_id name images")
        .sort({ _id: -1 }) 
        .limit(limit);

    const hasMore = products.length === limit;

    const nextCursor = hasMore
        ? products[products.length - 1]._id
        : null;

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                products,
                nextCursor,
                hasMore
            },
            "Products fetched successfully"
        )
    );
});

const getProductById = asyncHandler(async (req, res) => {
    const { productId } = req.params

    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(404, "Product not found")
    }

    const seller = await Seller.findById(product.seller)

    if(!seller) {
        throw new ApiError(404, "Seller not found for this product")
    }

    const upiId = seller.upiId;
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(seller.businessName)}&am=${product.price}&cu=INR`;
    const qrImageDataUrl = await QRCode.toDataURL(upiUrl);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {product, upiUrl, qrImageDataUrl},
                "Product fetched successfully"
            )
        )
})

const placeOrder = asyncHandler(async (req, res) => {
    let { quantity, shippingAddressId } = req.body;
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    const seller = await Seller.findById(product.seller);

    if (!seller) {
        throw new ApiError(404, "Seller not found for this product");
    }

    const shippingAddress = await Address.findById(shippingAddressId);

    if (!shippingAddress) {
        const latestAddress = await Address.findOne({ user: req.user._id, type: "customer" }).sort({ createdAt: -1 }).select('_id');

        if (!latestAddress) {
            throw new ApiError(400, "No shipping address found. Please provide a shipping address.");
        }

        shippingAddressId = latestAddress._id;
    }

    const qty = Number(quantity);
    const price = Number(product.price.replace(/[^\d]/g, ""));
    const totalPrice = price * qty;

    const order = new Order({
        userId: req.user._id,
        productId,
        sellerId: seller._id,
        quantity,
        totalPrice,
        shippingAddress: shippingAddressId
    });

    await order.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            order,
            "Order placed successfully"
        )
    );
})

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ userId: req.user._id })
        .populate('productId', 'name images')    

    return res.status(200).json(
        new ApiResponse(
            200,
            orders,
            "Orders fetched successfully"
        )
    );
})

const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId)
        .populate('productId', 'name price images')
        .populate('shippingAddress', 'country houseNumber street landmark pinCode city state');

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order fetched successfully"
        )
    );
})

const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (order.status !== 'pending') {
        throw new ApiError(400, "Only pending orders can be canceled");
    }

    order.status = OrderStatusEnum.CANCELLED;
    await order.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            order,
            "Order canceled successfully"
        )
    );
})

// cart controllers

const getCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('products.product', 'name price images');

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Cart fetched successfully"
        )
    );
})

const addToCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    if(product.quantity <= 0) {
        throw new ApiError(400, "Product is out of stock");
    }

    let cart = await Cart.findOne({ user: req.user._id }); 

    if (!cart) {
        cart = new Cart({
            user: req.user._id,
            products: [{ product: productId, quantity: 1 }]
        });
        
        await cart.save();
        
        return res.status(201).json(
            new ApiResponse(
                201,
                cart,
                "Product added to cart successfully"
            )
        );
    }

    const existingItemIndex = cart.products.findIndex(
        item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
        cart.products[existingItemIndex].quantity += 1;
    } else {
        cart.products.push({ product: productId, quantity: 1 });
    }

    await cart.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Product added to cart successfully"
        )
    );
});

const removeFromCart = asyncHandler(async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const itemIndex = cart.products.findIndex(
        item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
        throw new ApiError(404, "Product not found in cart");
    }

    cart.products.splice(itemIndex, 1);
    await cart.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            cart,
            "Product removed from cart successfully"
        )
    );
})

export {
    addNewAddress,
    getAllAddresses,
    deleteAddress,
    updateAddress,
    getProducts,
    getProductById,
    placeOrder,
    getOrders,
    getOrderById,
    cancelOrder,
    getCart,
    addToCart,
    removeFromCart
}