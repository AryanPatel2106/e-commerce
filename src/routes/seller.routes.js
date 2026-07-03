import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { verifySeller } from "../middlewares/seller.middleware.js"
import { registerSeller } from "../controllers/seller.controllers.js"

const router = Router();
router.use(verifyJWT);

router.route("/register").post(
    registerSeller
);

export default router;