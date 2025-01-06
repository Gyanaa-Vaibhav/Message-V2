import express from 'express';
import { renderLogin } from '../controllers/LoginController.js';
const loginRouter = express.Router();
// Default route to render the Login page
loginRouter.get('/', renderLogin);
loginRouter.post('/', (req, res) => {
    console.log(req.body);
    res.json({ success: true, message: 'Hello' });
});
export default loginRouter;
