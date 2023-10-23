const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { PrismaClient } = require("@prisma/client")

const addMessage = async (req, res) => {
    const prisma = new PrismaClient();
    if (
        req.user &&
        req.body.recipentId &&
        req.params.orderId &&
        req.body.message
    ) {
        const message = await prisma.message.create({
            data: {
                sender: {
                    connect: {
                        id: parseInt(req.user.userId),
                    },
                },
                recipient: {
                    connect: {
                        id: parseInt(req.body.recipentId),
                    },
                },
                text: req.body.message,
            },
        });
        return res.status(StatusCodes.CREATED).json({ message })
    }
    throw new CustomError.BadRequestError("UserId, recipentId and message is required")
}

module.exports = {
    addMessage
}