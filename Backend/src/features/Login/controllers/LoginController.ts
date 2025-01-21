// Controller for Login
import {NextFunction, Request, Response} from 'express';
import {hashPassword} from "../../Register/utils/hashPassword.js";
import {getUserData} from "../../../config/DataBase/dbExports.js";
import {validateOtp} from "../models/LoginModel.js";
import dotenv from "dotenv";
dotenv.config()

export const renderLogin = (req: Request, res: Response) => {
    res.json({success:true,message:'Render Login page here'});
};

const otpData: { [email: string]: number } = {};

export const handelLogin = async (req: Request, res: Response,next:NextFunction) => {
    try {

        console.log(req.body)
        const email = req.body.email

        const [userData] = await getUserData(email);
        if(!userData) {
            res.json({success:false,message:'User does not exists please register',email:true})
            return;
        }

        const verify = validateOtp({req,res,userData,otpData,email})
        if(verify) return;

        otpData[email] = Math.floor(Math.random() * 10000)
        console.log(otpData)

        if(!process.env.PASSWORD_HASH) return;
        const password = hashPassword(req.body.password,process.env.PASSWORD_HASH)
        if(password !== userData.password) {
            res.json({success:false,message:'Wrong Password please try again',password:true})
            return;
        }

        res.json({
            success: true,
            optGenerated:true,
        });
    }catch (e){
        next(e)
    }
}