// Controller for Register
import {NextFunction, Request, Response} from 'express';
import * as crypto from 'crypto'
import {hashPassword} from "../utils/hashPassword.js";
import dotenv from "dotenv";
import {addUser} from "../../../shared/DataBase/dbExports.js";
import {checkUser, encryptPrivateKey, genSalts, sendSaltsEmail} from "../models/RegisterModel.js";
dotenv.config();

export const renderRegister = (res:Response) => {
    res.send('Render Register page here');
};

export const handelRegister = async (req:Request, res:Response,next:NextFunction) => {
    try {
        if(!process.env.PASSWORD_HASH) throw new Error('.ENV missing');

        const email = req.body.email;
        const username = req.body.username;
        const password = hashPassword(req.body.password,process.env.PASSWORD_HASH);

        const userExists = await checkUser(email,username)
        if(userExists){
            res.json(userExists)
            return;
        }

        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'spki',
                format: 'pem',
            },
            privateKeyEncoding: {
                type: 'pkcs8',
                format: 'pem',
            },
        });

        const concatenatedSalts = genSalts();
        const hashedPrivateKey = encryptPrivateKey(privateKey,email)
        const encryptedPrivateKey = encryptPrivateKey(hashedPrivateKey,concatenatedSalts)

        sendSaltsEmail(concatenatedSalts,email,username);

        const userObject = {username,password,email,public_key:publicKey,private_key:encryptedPrivateKey}
        await addUser(userObject)

        res.json({success:true,message:'Registration Successful',hashedPrivateKey})

    }catch (error:any){
        console.log(error.stack)
        console.log(error)
        next(error)
    }
}