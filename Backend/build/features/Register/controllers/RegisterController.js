import { hashPassword } from "../utils/hashPassword.js";
import dotenv from "dotenv";
import { getUser } from "../../../shared/DataBase/getQueries/getUser.js";
import { addUser } from "../../../shared/DataBase/dbExports.js";
dotenv.config();
export const renderRegister = (req, res) => {
    res.send('Render Register page here');
};
export const handelRegister = async (req, res, next) => {
    try {
        if (!process.env.PASSWORD_HASH)
            return;
        const password = hashPassword(req.body.password, process.env.PASSWORD_HASH);
        const userObject = { username: req.body.username, password, email: req.body.email };
        const [user] = await getUser(req.body.email, req.body.username);
        if (user) {
            console.log(user);
            if (user.user_name === req.body.username) {
                res.json({ success: false, message: 'User already exist please login', username: true });
                return;
            }
            if (user.email === req.body.email) {
                res.json({ success: false, message: 'User already exist please login' });
                return;
            }
            return;
        }
        await addUser(userObject);
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //     modulusLength: 2048,
        //     publicKeyEncoding: {
        //         type: 'spki',
        //         format: 'pem',
        //     },
        //     privateKeyEncoding: {
        //         type: 'pkcs8',
        //         format: 'pem',
        //     },
        // });
        res.json({ success: false, message: 'Failed' });
    }
    catch (e) {
        next(e);
    }
};
