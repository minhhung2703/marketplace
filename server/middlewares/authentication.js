const CustomError = require("../errors")
const { verifyToken } = require("../utils")

const authenticateUsers = async (req, res, next) => {
    const token = req.signedCookies.token
    if (!token) {
        throw new CustomError.UnauthenticatedError("Authenticated Invalid")
    }
    try {
        const payload = verifyToken({ token });
        req.user = payload.payload
        next();
    } catch (error) {
        console.log(error)
        throw new CustomError.UnauthenticatedError("Authentication Invalid");
    }
}

module.exports = authenticateUsers