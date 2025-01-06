import express from 'express';
import { renderRegister } from '../controllers/RegisterController.js';

const RegisterRouter = express.Router();

// Default route to render the Register page
RegisterRouter.get('/', renderRegister);

export default RegisterRouter;
