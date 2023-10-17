const { Prisma, PrismaClient } = require("@prisma/client");
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

                return res.status(201).send("Successfully created the gig.");
            }
        }
        return res.status(400).send("All properties should be required.");
    } catch (err) {
        console.log(err);
    }
}
module.exports = { addGigs }