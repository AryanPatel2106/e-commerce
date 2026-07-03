import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";

const verifyAdmin = asyncHandler(async (req, res, next) => {
    const user = req.user;

    if(!user){
        throw new ApiError(401, "Unauthorized request")
    }

    if(!user.role.includes("admin")){
        throw new ApiError(403, "Forbidden request. User is not an admin")
    }

    next()
})

export { verifyAdmin }