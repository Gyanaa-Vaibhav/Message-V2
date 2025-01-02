import express from 'express';
import { renderLogin } from '../controllers/LoginController';
const loginRouter = express.Router();
// Default route to render the Login page
loginRouter.get('/', renderLogin);
export default loginRouter;
