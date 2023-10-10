const jwt = require("jsonwebtoken");

const createJWT = ({ payload }) => {
    return jwt.sign(
        { payload },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    );
};

const verifyToken = ({ token }) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

const attackCookieToResponse = ({ res, user }) => {
    const tokenUser = createJWT({ payload: user })
    const oneDay = 1000 * 60 * 60 * 24 * 30
    res.cookie("token", tokenUser, {
        expires: new Date(Date.now() + oneDay),
        httpOnly: true,
        signed: true,
        secure: true,
    });
};

module.exports = {
    createJWT,
    verifyToken,
    attackCookieToResponse
}