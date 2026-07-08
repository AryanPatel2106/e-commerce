import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { verifySeller } from "../middlewares/seller.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { registerSeller, getSellerProfile, addProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controllers/seller.controllers.js"
import { sellerRegisterValidator, addProductValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();
router.use(verifyJWT);

router.route("/register").post(
    sellerRegisterValidator(),
    validate,
    registerSeller
);

router.route("/profile").get(
    verifySeller,
    getSellerProfile
);

router.route("/products")
    .get(
        verifySeller,
        getAllProducts
    )
    .post(
        upload.array("attachments"),
        addProductValidator(),
        validate,
        verifySeller,
        addProduct
    )

router.route("/products/:productId")
    .get(
        verifySeller,
        getProductById
    )
    .put(
        upload.array("attachments"),
        verifySeller,
        updateProduct
    )
    .delete(
        verifySeller,
        deleteProduct
    )

export default router;