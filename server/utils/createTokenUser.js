const createTokenUser = (user) => {
    return { email: user.email, userId: user.id }
}
module.exports = createTokenUser