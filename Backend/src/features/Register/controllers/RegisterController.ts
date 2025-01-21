// Controller for Register
import {NextFunction, Request, Response} from 'express';
import * as crypto from 'crypto'
import {hashPassword} from "../utils/hashPassword.js";
import dotenv from "dotenv";
import {addUser} from "../../../config/DataBase/dbExports.js";
import {checkUserData, encryptPrivateKey, genSalts} from "../models/RegisterModel.js";
import {addToKeys} from "../../../config/DataBase/addQueries/addToKeys.js";
dotenv.config();

export const renderRegister = (res:Response) => {
    res.send('Render Register page here');
};

export const handelRegister = async (req:Request, res:Response,next:NextFunction) => {
    try {
        if(!process.env.PASSWORD_HASH) {
            console.log('.ENV missing')
            return;
        }

        const email = req.body.email;
        const username = req.body.username;
        const password = hashPassword(req.body.password,process.env.PASSWORD_HASH);

        const userDetails = await checkUserData(email,username)
        if(userDetails){
            res.json(userDetails)
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

        // sendSaltsEmail(concatenatedSalts,email,username);

        const user_Id = await addUser({username,password,email});
        const keysObject = {user_Id,salt:concatenatedSalts,public_key:publicKey,private_key:encryptedPrivateKey}
        await addToKeys(keysObject)

        res.json({success:true,message:'Registration Successful'})

    }catch (error:any){
        console.log(error.stack)
        console.log(error)
        next(error)
    }
}