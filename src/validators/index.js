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

const sellerRegisterValidator = () => {
    return [
        body("sellerType")
            .trim()
            .notEmpty()
            .withMessage("Seller type is required"),
        body("businessName")
            .trim()
            .notEmpty()
            .withMessage("Business name is required"),
        body("businessRegistrationNumber")
            .trim()
            .notEmpty()
            .withMessage("Business registration number is required"),
        body("businessRegistrationProof")
            .trim()
            .notEmpty()
            .withMessage("Business registration proof is required"),
        body("panNumber")
            .trim()
            .notEmpty()
            .withMessage("PAN number is required"),
        body("gstNumber")
            .trim()
            .notEmpty()
            .withMessage("GST number is required"),
        body("governmentIssuedIdType")
            .trim()
            .notEmpty()
            .withMessage("Government issued ID type is required"),
        body("governmentIssuedIdNumber")
            .trim()
            .notEmpty()
            .withMessage("Government issued ID number is required"),
        body("governmentIssuedIdProof")
            .trim()
            .notEmpty()
            .withMessage("Government issued ID proof is required"),
        body("proofOfAddressType")
            .trim()
            .notEmpty()
            .withMessage("Proof of address type is required"),
        body("proofOfAddressDocument")
            .trim()
            .notEmpty()
            .withMessage("Proof of address document is required"),
        body("proofOfAddressDate")
            .trim()
            .notEmpty()
            .withMessage("Proof of address date is required"),
        body("internationallyChargeableCreditCardBrand")
            .trim()
            .notEmpty()
            .withMessage("Internationally chargeable credit card brand is required"),
        body("internationallyChargeableCreditCardLast4")
            .trim()
            .notEmpty()
            .withMessage("Internationally chargeable credit card last 4 digits are required"),
        body("internationallyChargeableCreditCardToken")
            .trim()
            .notEmpty()
            .withMessage("Internationally chargeable credit card token is required"),
        body("upiId")
            .trim()
            .notEmpty()
            .withMessage("UPI ID is required"),
        body("bankAccountHolderName")
            .trim()
            .notEmpty()
            .withMessage("Bank account holder name is required"),
        body("bankAccountNumber")
            .trim()
            .notEmpty()
            .withMessage("Bank account number is required"),
        body("bankIfscCode")
            .trim()
            .notEmpty()
            .withMessage("Bank IFSC code is required"),
        body("bankName")
            .trim()
            .notEmpty()
            .withMessage("Bank name is required"),
        body("bankBranch")
            .trim()
            .notEmpty()
            .withMessage("Bank branch is required"),
        body("businessPhoneNumber")
            .trim()
            .notEmpty()
            .withMessage("Business phone number is required"),
        body("businessEmail")
            .trim()
            .notEmpty()
            .withMessage("Business email is required"),
        body("country")
            .trim()
            .notEmpty()
            .withMessage("Country is required"),
        body("houseNumber")
            .trim()
            .notEmpty()
            .withMessage("House number is required"),
        body("street")
            .trim()
            .notEmpty()
            .withMessage("Street is required"),
        body("landmark")
            .trim()
            .notEmpty()
            .withMessage("Landmark is required"),
        body("pinCode")
            .trim()
            .notEmpty()
            .withMessage("Pin code is required"),
        body("city")
            .trim()
            .notEmpty()
            .withMessage("City is required"),
        body("state")
            .trim()
            .notEmpty()
            .withMessage("State is required")
    ]
}

const addProductValidator = () => {
    return [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Product name is required"),
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Product description is required"),
        body("price")
            .notEmpty()
            .withMessage("Product price is required"),
        body("quantity")
            .notEmpty()
            .withMessage("Product quantity is required"),
        body("category")
            .trim()
            .notEmpty()
            .withMessage("Product category is required")
    ]
}

export {
    userRegisterValidator,
    userLoginValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordValidator,
    createAddressValidator,
    sellerRegisterValidator,
    addProductValidator
}