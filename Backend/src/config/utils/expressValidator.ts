import {body,validationResult} from "express-validator";
import {NextFunction,Request,Response} from "express";

function validateUser(param:string){
    return body(param)
        .notEmpty()
        .withMessage(`${param} is required`)
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage(`${param} must contain only letters and numbers`)
        .escape()
}

function validatePassword(param:string){
    return body(param)
        .notEmpty()
        .withMessage(`${param} is required`)
        .isLength({min:8})
        .withMessage(`${param} must be at least 8 characters long`)
        .escape()
}

function comparePass(){
    return body('confirm_password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Confirm Password does not match Password');
            }
            return true;
        })
}

function validateEmail(param:string){
    return body(param)
        .notEmpty()
        .withMessage(`${param} is required`)
        .isEmail()
        .withMessage(`${param} must be a valid email`)
        .escape()
}

export const validateRegister = [
    validateUser('username'),
    validatePassword('password'),
    validateEmail('email'),
    comparePass()
]

export const validateLogin = [
    validateEmail('email'),
    validatePassword('password')
]

// Middleware to Handle Validation Errors
export const validate = (req:Request, res:Response, next:NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            errors: errors.array().map(err => ({
                field: (err as any).param,
                message: err.msg,
            })),
        });
        return;
    }
    next();
};