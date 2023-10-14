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

const getUserAuthGigs = async (req, res) => {
    // try {
    if (req.user) {
        const prisma = new PrismaClient();
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            include: { gigs: true },
        })
        res.status(StatusCodes.OK).json({ gigs: user?.gigs ?? [] });
    }
    throw new CustomError.BadRequestError('UserId should be required')
    // } catch (error) {
    //     console.log(error)
    // }

}

const checkGigOrder = async (req, res) => {
    res.status(200).json('check Gig Order')
}

const editGig = async (req, res) => {
    res.status(200).json('edit Gig')
}

const getGigData = async (req, res) => {
    res.status(200).json('get Gig Data')
}


const searchGigs = async (req, res) => {
    res.status(200).json('search Gigs')
}

const addReview = async (req, res) => {
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