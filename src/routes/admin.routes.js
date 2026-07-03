import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { verifyAdmin } from "../middlewares/admin.middleware.js"
import {
    getAllSellers,
    getPendingSellers,
    getSellerById,
    approveSeller,
    rejectSeller
} from "../controllers/admin.controllers.js"

const router = Router();
router.use(verifyJWT);
router.use(verifyAdmin);

router.route("/get-all-sellers").get(
    getAllSellers
)

router.route("/get-pending-sellers").get(
    getPendingSellers
)

router.route("/:sellerId")
    .get(
        getSellerById
    )

router.route("/:sellerId/approve").put(
    approveSeller
)

router.route("/:sellerId/reject").put(
    rejectSeller
)

export default router;