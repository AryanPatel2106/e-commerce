import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("email is invalid"),
        body("fullName")
            .optional()
            .trim(),
        body("phoneNumber")
            .trim()
            .notEmpty()
            .withMessage("phone number is required")
            .isMobilePhone()
            .withMessage("phone number is invalid"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required"),
        body("country")
            .trim()
            .notEmpty()
            .withMessage("country name is required"),
        body("houseNumber")
            .trim()
            .notEmpty()
            .withMessage("houseNumber is required"),
        body("street")
            .trim()
            .notEmpty()
            .withMessage("street is required"),
        body("landmark")
            .trim()
            .notEmpty()
            .withMessage("landmark is required"),
        body("pinCode")
            .trim()
            .notEmpty()
            .withMessage("pinCode is required"),
        body("city")
            .trim()
            .notEmpty()
            .withMessage("city is required"),
        body("state")
            .trim()
            .notEmpty()
            .withMessage("state is required")
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is Invalid"),
        body("password")
            .notEmpty()
            .withMessage("Password is required")
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email")
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid")
    ]
}

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
            .notEmpty()
            .withMessage("Password is required")
    ]
}

const createAddressValidator = () => {
    return [
        body("country")
            .trim()
            .notEmpty()
            .withMessage("country name is required"),
        body("houseNumber")
            .trim()
            .notEmpty()
            .withMessage("houseNumber is required"),
        body("street")
            .trim()
            .notEmpty()
            .withMessage("street is required"),
        body("landmark")
            .trim()
            .notEmpty()
            .withMessage("landmark is required"),
        body("pinCode")
            .trim()
            .notEmpty()
            .withMessage("pinCode is required"),
        body("city")
            .trim()
            .notEmpty()
            .withMessage("city is required"),
        body("state")
            .trim()
            .notEmpty()
            .withMessage("state is required")
    ]
}

export {
    userRegisterValidator,
    userLoginValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createAddressValidator
}