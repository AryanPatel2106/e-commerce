import { Router } from "express";
import { addNewAddress, getAllAddresses, deleteAddress, updateAddress, setDefaultAddress, getProducts, getProductById, giveRating, getOrders,getOrderById, cancelOrder, getCart, addToCart, removeFromCart, qtyIncrement, qtyDecrement } from "../controllers/customer.controllers.js"
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
    .patch(
        verifyJWT,
        setDefaultAddress
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
    .patch(
        verifyJWT,
        giveRating
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
    .put(
        verifyJWT,
        qtyIncrement
    )

router.route("/cart/:productId/increment")
    .put(
        verifyJWT,
        qtyIncrement
    )

router.route("/cart/:productId/decrement")
    .put(
        verifyJWT,
        qtyDecrement
    )

export default router;