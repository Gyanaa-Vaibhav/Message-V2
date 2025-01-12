import express from 'express';
import {handelRegister, renderRegister} from '../controllers/RegisterController.js';
import {validate, validateRegister} from "../../../shared/utils/expressValidator.js";

const RegisterRouter = express.Router();

// Default route to render the Register page
RegisterRouter.get('/', renderRegister);

RegisterRouter.post('/',
    validateRegister,
    validate,
    handelRegister
)

export default RegisterRouter;
