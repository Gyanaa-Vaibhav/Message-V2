import express from 'express';
import { handelLogin, renderLogin } from '../controllers/LoginController.js';
const loginRouter = express.Router();
// Default route to render the Login page
loginRouter.get('/', renderLogin);
loginRouter.post('/', handelLogin);
export default loginRouter;
