const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const createTokenUser = require("../utils/createTokenUser");
const { attackCookieToResponse } = require("../utils/jwt");
const fs = require('fs')

const generatePassword = async (password) => {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
};

const signup = async (req, res, next) => {
    const prisma = new PrismaClient();
    const { email, password } = req.body;
    const existUser = await prisma.user.findUnique({
        where: {
            email
        },
    });
    if (existUser) {
        throw new CustomError.BadRequestError("Email already exist");
    }
    if (email || password) {
        const user = await prisma.user.create({
            data: {
                email,
                password: await generatePassword(password),
            },
        });
        const tokenUser = createTokenUser(user);
        attackCookieToResponse({ res, user: tokenUser });
        return res.status(StatusCodes.OK).json({
            user: { id: user?.id, emai: user?.email }
        });
    } else {
        throw new CustomError.BadRequestError("Email and Password required");
    }
}

const login = async (req, res, next) => {
    const prisma = new PrismaClient();
    const { email, password } = req.body;
    if (email || password) {
        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new CustomError.BadRequestError("User not found");
        }

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            throw new CustomError.BadRequestError("Invalid Password");
        }

        const tokenUser = createTokenUser(user);
        attackCookieToResponse({ res, user: tokenUser });
        return res.status(StatusCodes.OK).json({
            user: {
                id: user?.id,
                email: user?.email,
            }
        });
    } else {
        throw new CustomError.BadRequestError("Email and Password required");
    }
}

const logout = async (req, res) => {
    res.cookie('token', 'logout', {
        expires: new Date(Date.now() + 1000),
        httpOnly: true,
    });
    res.status(StatusCodes.OK).json({ msg: "user logged out" })
}

const getUserInfo = async (req, res, next) => {
    if (!req.user) {
        throw new CustomError.BadRequestError("Missing userId in request");
    }
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
        // where: { email: req.user.email, },
        where: { id: req.user.userId },
    });
    if (!user) {
        throw new CustomError.NotFoundError("User not found");
    }
    res.status(StatusCodes.OK).json({
        user: {
            id: user?.id,
            email: user?.email,
            image: user?.profileImage,
            username: user?.username,
            fullname: user?.fullName,
            description: user?.description,
            isProfileSet: user?.isProfileInfoSet,
        },
    });
}

const setUserInfo = async (req, res, next) => {
    if (req?.user) {
        const { userName, fullName, description } = req.body;
        if (userName && fullName && description) {
            const prisma = new PrismaClient();
            const userNameValid = await prisma.user.findUnique({
                where: { username: userName },
            });

            if (userNameValid) {
                res.status(StatusCodes.OK).json({ userNameError: true })
            }

            await prisma.user.update({
                where: { id: req.user.userId },
                data: {
                    username: userName,
                    fullName,
                    description,
                    isProfileInfoSet: true,
                }
            });
            res.status(StatusCodes.OK).json("Profile data updated successfully");
        }
    } else {
        throw new CustomError.BadRequestError("UserName, FullName and Description should be included.");
    }
}

const setUserImage = async (req, res, next) => {
    if (req.file) {
        if (req?.user) {
            const date = Date.now();
            let fileName = `/uploads/profiles/` + date + req.file.originalname;
            fs.renameSync(req.file.path, fileName);
            const prisma = new PrismaClient();

            await prisma.user.update({
                where: { id: req.user.userId },
                data: { profileImage: fileName },
            });
            return res.status(StatusCodes.OK).json({ img: fileName });
        }
        throw new CustomError.BadRequestError("Cookie Error.")
    }
    throw new CustomError.BadRequestError("Image not include")
}

module.exports = {
    signup,
    login,
    logout,
    getUserInfo,
    setUserImage,
    setUserInfo
}