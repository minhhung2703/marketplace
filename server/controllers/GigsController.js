const { PrismaClient } = require("@prisma/client");
const CustomError = require("../errors");
const fs = require("fs");
const { StatusCodes } = require("http-status-codes");

const addGigs = async (req, res) => {
    try {
        if (req.files) {
            const fileKeys = Object.keys(req.files);
            const fileNames = [];
            fileKeys.forEach((file) => {
                const date = Date.now();
                fs.renameSync(
                    req.files[file].path,
                    "uploads/" + date + req.files[file].originalname
                );
                fileNames.push(date + req.files[file].originalname);
            });
            if (req.query) {
                const {
                    title,
                    description,
                    category,
                    features,
                    price,
                    revisions,
                    time,
                    shortDesc,
                } = req.query;
                const prisma = new PrismaClient();

                await prisma.gigs.create({
                    data: {
                        title,
                        description,
                        deliveryTime: parseInt(time),
                        category,
                        features,
                        price: parseInt(price),
                        shortDesc,
                        revisions: parseInt(revisions),
                        createdBy: { connect: { id: req.user.userId } },
                        images: fileNames,
                    },
                });
                return res.status(StatusCodes.CREATED).json("Successfully created the gig.");
            }
        }
        throw new CustomError.BadRequestError("All properties should be required.");
    } catch (err) {
        console.log(err);
    }
}

const getUserAuthGigs = async (req, res) => {
    if (req.user) {
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: { gigs: true },
        });
        return res.status(StatusCodes.CREATED).json({ user })
    }
    throw new CustomError.BadRequestError("UserId should be required")
}

const getGigData = async (req, res, next) => {
    if (req.params.gigId) {
        const prisma = new PrismaClient();
        const gig = await prisma.gigs.findUnique({
            where: { id: parseInt(req.params.gigId) },
            include: {
                reviews: {
                    include: { reviewer: true },
                },
                createdBy: true
            },
        });

        const userWithGigs = await prisma.user.findUnique({
            where: { id: gig?.createdBy.id },
            include: {
                gigs: {
                    include: { reviews: true }
                },
            },
        });

        const totalReviews = userWithGigs.gigs.reduce((acc, gig) => acc + gig.reviews.length, 0);

        const averageRating = (
            userWithGigs.gigs.reduce(
                (acc, gig) => acc + gig.reviews.reduce((sum, review) => sum + review.rating, 0), 0
            ) / totalReviews.totalReviews
        ).toFixed(1);
        return res.status(StatusCodes.OK).json({ gig: { ...gig, totalReviews, averageRating } });
    }
    throw new CustomError.BadRequestError("GigId should be required")
}

const editGig = async (req, res) => {
    if (req.files) {
        const fileKeys = Object.keys(req.files);
        const fileNames = [];
        fileKeys.forEach((file) => {
            const date = Date.now();
            fs.renameSync(
                req.files[file].path,
                "uploads/" + date + req.files[file].originalname
            );
            fileNames.push(date + req.files[file].originalname);
        });
        if (req.query) {
            const {
                title,
                description,
                category,
                features,
                price,
                revisions,
                time,
                shortDesc
            } = req.query;
            const prisma = new PrismaClient();
            const oldData = await prisma.gigs.findUnique({
                where: { id: parseInt(req.params.gigId) },
            });
            await prisma.gigs.update({
                where: { id: parseInt(req.params.gigId) },
                data: {
                    title,
                    description,
                    deliveryTime: parseInt(time),
                    category,
                    features,
                    price: parseInt(price),
                    shortDesc,
                    revisions: parseInt(revisions),
                    createdBy: { connect: { id: parseInt(req.userId) } },
                    images: fileNames,
                },
            });

            oldData?.images.forEach((image) => {
                if (fs.existsSync(`uploads/${image}`)) fs.unlinkSync(`uploads/${image}`);
            });

            return res.status(StatusCodes.CREATED).json("Successfully Edit the gig");
        }
    }
    throw new CustomError.BadRequestError("All propertives should required");
}

module.exports = {
    addGigs,
    getUserAuthGigs,
    getGigData,
    editGig
}