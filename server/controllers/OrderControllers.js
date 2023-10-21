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
        const paymentIntent = await stripe.paymentInternt.create({
            amount: gig?.price * 100,
            currency: "usd",
            automatic_payment_methods: {
                enable: true,
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

module.exports = {
    createOrder
}