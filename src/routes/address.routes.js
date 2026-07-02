import { Router } from "express";
import { addNewAddress, getAllAddresses, deleteAddress, updateAddress } from "../controllers/address.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createAddressValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/")
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

export default router;