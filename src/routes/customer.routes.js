import { Router } from "express";
import { addNewAddress, getAllAddresses, deleteAddress, updateAddress, getProducts, getProductById, placeOrder, getOrders,getOrderById, cancelOrder, getCart, addToCart, removeFromCart } from "../controllers/customer.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createAddressValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/addresses")
    .get(
        verifyJWT,
        getAllAddresses
    )
    .post(
        verifyJWT,
        createAddressValidator(),
        validate,
        addNewAddress
    )

router.route("/:addressId")
    .delete(
        verifyJWT,
        deleteAddress
    )
    .put(
        verifyJWT,
        updateAddress
    )

// product routes

router.route("/products")
    .get(
        verifyJWT,
        getProducts
    )

router.route("/products/:productId")
    .get(
        verifyJWT,
        getProductById
    )
    .post(
        verifyJWT,
        placeOrder
    )

router.route("/orders")
    .get(
        verifyJWT,
        getOrders
    )

router.route("/orders/:orderId")
    .get(
        verifyJWT,
        getOrderById
    )
    .patch(
        verifyJWT,
        cancelOrder
    )

router.route("/cart")
    .get(
        verifyJWT,
        getCart
    )

router.route("/cart/:productId")
    .post(
        verifyJWT,
        addToCart
    )
    .delete(
        verifyJWT,
        removeFromCart
    )

export default router;