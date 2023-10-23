const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { PrismaClient } = require("@prisma/client");

const addMessage = async (req, res) => {
    try {
        const prisma = new PrismaClient();
        const { recipentId, message } = req.body
        if (
            req.user &&
            recipentId &&
            req.params.orderId &&
            message
        ) {
            const message = await prisma.message.create({
                data: {
                    sender: {
                        connect: { id: parseInt(req.user.userId), },
                    },
                    recipient: {
                        connect: { id: parseInt(recipentId), },
                    },
                    order: {
                        connect: { id: parseInt(req.params.orderId), },
                    },
                    text: req.body.message,
                },
            });
            return res.status(StatusCodes.CREATED).json({ message })
        }
        throw new CustomError.BadRequestError("UserId, recipentId and message is required")
    } catch (error) {
        console.log(error)
    }
}

const getMessages = async (req, res) => {
    if (req.params.orderId && req.user.userId) {
        const prisma = new PrismaClient();
        const messages = await prisma.message.findMany({
            where: {
                order: {
                    id: parseInt(req.params.orderId),
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        await prisma.message.updateMany({
            where: {
                orderId: parseInt(req.params.orderId),
                recipientId: parseInt(req.user.userId),
            },
            data: {
                isRead: true,
            },
        });

        const order = await prisma.orders.findUnique({
            where: { id: parseInt(req.params.orderId) },
            include: { gig: true },
        });

        let recipentId;
        if (order?.buyerId === req.user.userId) {
            recipentId = order.gig.userId
        } else if (order?.gig.userId === req.user.userId) {
            recipentId = order.buyerId;
        }
        return res.status(StatusCodes.OK).json({ messages, recipentId })
    }
    throw new CustomError.BadRequestError("Oreder id id required")
}

const getUnreadMessage = async (req, res, next) => {
    if (req.user) {
        const prisma = new PrismaClient();
        const messages = await prisma.message.findMany({
            where: {
                recipient: req.user.userId,
                isRead: true
            },
            include: {
                sender: true,
            }
        });
        return res.status(StatusCodes.OK).json({ messages })
    }
    throw new CustomError.BadRequestError("User id is required")
}

module.exports = {
    addMessage,
    getMessages,
    getUnreadMessage
}