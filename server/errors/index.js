const CustomAPIError = require('./custom-api')
const BadRequestError = require('./bad-request')
const NotFoundError = require('./not-found')
const UnauthenticatedError = require('./authenticated')
const UnauthorizedError = require('./authorized')

module.exports = {
    CustomAPIError,
    BadRequestError,
    NotFoundError,
    UnauthenticatedError,
    UnauthorizedError
}