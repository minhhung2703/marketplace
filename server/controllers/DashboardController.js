const { PrismaClient } = require("@prisma/client");
const CustomError = require("../errors")

const getSellerData = async (req, res) => {
    try {
        if (req.user) {
            const prisma = new PrismaClient();
            const gigs = await prisma.gigs.count({ where: { userId: req.user.userId } })
            const { _count: { id: orders } } = await prisma.orders.aggregate({
                where: {
                    isCompleted: true,
                    gig: {
                        createdBy: { id: req.user.userId }
                    },
                },
                _count: { id: true },
            });
            const unReadMessages = await prisma.message.count({
                where: {
                    recipientId: req.user.userId,
                    isRead: false,
                },
            });

            const today = new Date();
            const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const thisYear = new Date(today.getFullYear(), 0, 1);

            const {
                _sum: { price: revenue },
            } = await prisma.orders.aggregate({
                where: {
                    gig: {
                        createdBy: {
                            id: req.userId,
                        },
                    },
                    isCompleted: true,
                    createdAt: {
                        gte: thisYear,
                    },
                },
                _sum: {
                    price: true,
                },
            });

            const {
                _sum: { price: dailyRevenue },
            } = await prisma.orders.aggregate({
                where: {
                    gig: {
                        createdBy: {
                            id: req.user.userId,
                        },
                    },
                    isCompleted: true,
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    },
                },
                _sum: {
                    price: true,
                }
            });
            const {
                _sum: { price: monthlyRevenue },
            } = await prisma.orders.aggregate({
                where: {
                    gig: {
                        createdBy: {
                            id: req.userId,
                        },
                    },
                    isCompleted: true,
                    createdAt: {
                        gte: thisMonth,
                    },
                },
                _sum: {
                    price: true,
                },
            });
            return res.status(200).json({
                dashboardData: {
                    orders,
                    gigs,
                    unReadMessages,
                    dailyRevenue,
                    monthlyRevenue,
                    revenue,
                },
            });
        }
        throw new CustomError.BadRequestError("User id is required.")
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    getSellerData
}