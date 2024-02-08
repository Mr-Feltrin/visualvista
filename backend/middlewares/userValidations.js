const { body } = require("express-validator");

const userCreateValidation = () => {
    return [body("name").isString().withMessage("O nome é obrigatório").isLength({ min: 3 }).withMessage("O nome precisa ter ao menos 3 caracteres"),
    body("email").isString().withMessage("O email é obrigatório").isEmail().withMessage("Insira um email válido"),
    body("password").isString().withMessage("A senha é obrigatória").isLength({ min: 5 }).withMessage("A senha deve ter ao mínimo 5 caracteres"),
    body("confirmPassword").isString().withMessage("A confirmação de senha é obrigatória").custom((value, { req }) => {
        if (value != req.body.password) {
            throw new Error("As senhas não são iguais");
        }
        return true;
    })
    ]
}

const loginValidation = () => {
    return [
        body("email").isString().withMessage("O email é obrigatório").isEmail().withMessage("Insira um email válido"),
        body("password").isString().withMessage("A senha é obrigatória")
    ]
}
 
const userUpdateValidation = () => {
    return [
        body("name").optional().isString().withMessage("O nome precisa ser uma string válida").isLength({ min: 3 }).withMessage("O nome precisa ter ao menos 3 caracteres"),
        body("password").optional().isString().withMessage("A senha precisa ser uma string válida").isLength({ min: 5 }).withMessage("A senha deve ter ao mínimo 5 caracteres"),
    ]
}

module.exports = {
    userCreateValidation,
    loginValidation,
    userUpdateValidation
}