const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const error = validationResult(req);
    if (error.isEmpty()) {
        return next();
    }
    const extractedErrors = [];
    error.array().map(err => extractedErrors.push(err.msg));

    return res.status(422).json({
        errors: extractedErrors
    });
}

module.exports = validate;