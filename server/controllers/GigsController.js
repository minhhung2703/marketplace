const CustomError = require('../errors')
const { PrismaClient } = require("@prisma/client")
const { StatusCodes } = require("http-status-codes")
const fs = require("fs")

const addGig = async (req, res) => {
    if (req.files) {
        const fileKeys = Object.keys(req.files);
        const fileNames = [];
        fileKeys.forEach((file) => {
            const date = Date.now();
            fs.renameSync(req.files[file].path,
                "uploads/" + date + req.files[file].originalname
            );
            fileNames.push(date + req.files[file].originalname);
        });
        if (req.query) {
            const { title, description, category, features, price, revisions, time, shortDesc } = req.query;
            const prisma = new PrismaClient();

            await prisma.gigs.create({
                data: {
                    title,
                    description,
                    category,
                    deliveryTime: parseInt(time),
                    features,
                    price: parseInt(price),
                    shortDesc,
                    revisions: parseInt(revisions),
                    createdBy: { connect: { id: req.user.userId } },
                    images: fileNames
                }
            });
            res.status(StatusCodes.CREATED).json({ title, description, category, features, price, revisions, time, shortDesc })
        }
    }
    throw new CustomError.BadRequestError("All properties should be required")
}

const checkGigOrder = async () => {
    res.status(200).json('check Gig Order')
}

const editGig = async () => {
    res.status(200).json('edit Gig')
}

const getGigData = async () => {
    res.status(200).json('get Gig Data')
}

const getUserAuthGigs = async () => {
    res.status(200).json('get User Auth Gigs')
}

const searchGigs = async () => {
    res.status(200).json('search Gigs')
}

const addReview = async () => {
    res.status(200).json('add Review')
}

module.exports = {
    addGig,
    checkGigOrder,
    editGig,
    getGigData,
    getUserAuthGigs,
    searchGigs,
    addReview,
}