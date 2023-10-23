const { StatusCodes } = require("http-status-codes")
const CustomError = require("../errors")
const { PrismaClient } = require("@prisma/client")
const Stripe = require("stripe")

const stripe = new Stripe(
    "sk_test_51DpVXWGc9EcLzRLBNKni929hB026lACv6toMfjH1FPtIXfYgIrhXzjolcYzDDl2VwtvmyPF20PJ1JaMUCTNoEwDN00FN8hrRZL"
)

const createOrder = async (req, res) => {
    if (req.body.gigId) {
        const { gigId } = req.body;
        const prisma = new PrismaClient();
        const gig = await prisma.gigs.findUnique({
            where: { id: parseInt(gigId) },
        });
        const paymentIntent = await stripe.paymentIntents.create({
            amount: gig?.price * 100,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        await prisma.orders.create({
            data: {
                paymentIntent: paymentIntent.id,
                price: gig?.price,
                buyer: { connect: { id: req?.user.userId } },
                gig: { connect: { id: gig?.id } },
            },
        })
        res.status(StatusCodes.OK).json({
            clientSecret: paymentIntent.client_secret,
        })
    } else {
        throw new CustomError.BadRequestError("Gig id is required")
    }
}

const confirmOrder = async (req, res) => {
    if (req.body.paymentIntent) {
        const prisma = new PrismaClient();
        const confirm = await prisma.orders.update({
            where: { paymentIntent: req.body.paymentIntent },
            data: { isCompleted: true }
        })
        res.status(StatusCodes.CREATED).json({ confirm })
    }
}

const getBuyerOrders = async (req, res) => {
    if (req.user) {
        const prisma = new PrismaClient();
        const orders = await prisma.orders.findMany({
            where: { buyerId: req.user.userId, isCompleted: true },
            include: { gig: true }
        });
        res.status(StatusCodes.OK).json({ orders })
    }
}

const getSellerOrders = async (req, res) => {
    try {
        if (req.user) {
            const prisma = new PrismaClient();
            const orders = await prisma.orders.findMany({
                where: {
                    gig: {
                        createdBy: {
                            id: parseInt(req.user.userId),
                        },
                    },
                    isCompleted: true,
                },
                include: {
                    gig: true,
                    buyer: true,
                },
            });
            return res.status(StatusCodes.OK).json({ orders })
        }
        throw new CustomError.BadRequestError("userId is required")
    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    createOrder,
    confirmOrder,
    getBuyerOrders,
    getSellerOrders
}