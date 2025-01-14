// Controller for Login
import CryptoJS from "crypto-js";
import { hashPassword } from "../../Register/utils/hashPassword.js";
import dotenv from "dotenv";
import { getUserData } from "../../../shared/DataBase/getQueries/getUserData.js";
import { generateAccessToken, generateRefreshToken } from "../../../shared/utils/jwt.js";
dotenv.config();
export const renderLogin = (req, res) => {
    res.json({ success: true, message: 'Render Login page here' });
};
export const handelLogin = async (req, res, next) => {
    try {
        const email = req.body.email;
        const [userData] = await getUserData(email);
        if (!userData) {
            res.json({ success: false, message: 'User does not exists please login', email: true });
            return;
        }
        if (!process.env.PASSWORD_HASH) {
            console.log('.ENV missing');
            return;
        }
        const password = hashPassword(req.body.password, process.env.PASSWORD_HASH);
        if (password !== userData.password) {
            res.json({ success: false, message: 'Wrong Password please try again', password: true });
            return;
        }
        if (!req.body.privateKey) {
            if (!req.body.salt) {
                res.json({ success: false, message: 'Keys/Salts should not be empty', key: true });
                return;
            }
        }
        try {
            if (req.body.salt) {
                CryptoJS.AES.decrypt(userData.private_key, req.body.salt).toString(CryptoJS.enc.Utf8);
            }
        }
        catch (e) {
            res.status(403).json({ success: false, message: 'Error Decrypting Keys. Salt is invalid', keys: true });
            return;
        }
        const payload = { user_id: userData.user_id, username: userData.username, email: userData.email };
        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);
        if (req.body.salt) {
            const decryptedKey = CryptoJS.AES.decrypt(userData.private_key, req.body.salt).toString(CryptoJS.enc.Utf8);
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false, // TODO change to true in Prod
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.json({
                success: true,
                decryptedKey,
                accessToken,
            });
            return;
        }
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false, // TODO change to true in Prod
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res.json({
            success: true,
            accessToken,
        });
    }
    catch (e) {
        next(); // TODO add GLOBAL ERROR Handler
    }
};
