import { Router } from "express";
import {registerUser, verifyOtpAndFinalizeRegister, resendOtp, setup2FA, verifyAndEnable2FA, disable2FA, loginUser, verify2FALogin, logoutUser, forgotPasswordRequest, resetForgotPassword, getCurrentUser, updateUserProfile } from "../controllers/auth.controllers.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { userRegisterValidator, userLoginValidator, userForgotPasswordValidator, userResetForgotPasswordValidator, createAddressValidator } from "../validators/index.js";
import { validate } from "../middlewares/validator.middleware.js";

const router = Router();

router.route("/register").post(
    userRegisterValidator(), 
    validate, 
    registerUser
);

router.route("/verify-otp").post(
    verifyOtpAndFinalizeRegister
);

router.route("/resend-otp").post(
    resendOtp
);

router.route("/setup-2fa").post(
    verifyJWT,
    setup2FA
);

router.route("/verify-2fa").post(
    verifyJWT,
    verifyAndEnable2FA
);

router.route("/disable-2fa").post(
    verifyJWT,
    disable2FA
);

router.route("/login").post(
    userLoginValidator(), 
    validate, 
    loginUser
);

router.route("/verify-2fa-login").post(
    verify2FALogin
);

router.route("/forgot-password").post(
    userForgotPasswordValidator(),
    validate,
    forgotPasswordRequest
)

router.route("/reset-password/:resetToken").post(
    userResetForgotPasswordValidator(),
    validate,
    resetForgotPassword
)

// PROTECTED ROUTES (Requires Active Access Token)

router.route("/logout").post(
    verifyJWT, 
    logoutUser
);

router.route("/current-user").get(
    verifyJWT,
    getCurrentUser
)

// profile routes

router.route("/update-profile").put(
    verifyJWT,
    updateUserProfile
)


export default router;