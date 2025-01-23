// Placeholder for the Login model
// Currently empty; add schema or logic here as needed
import { Request, Response } from 'express';
import decryptPrivateKey from "../../../config/utils/decryptPrivateKey.js";
import { generateAccessToken, generateRefreshToken } from "../../../config/utils/jwt.js";
import nodemailer from "nodemailer";

type ValidateOTP = {
    req:Request,
    res:Response
    otpData: { [email: string]: number },
    email:string,
    userData:any
}

function validateOtp({req,res,otpData,email,userData}:ValidateOTP){
    try {
        if(req.body.otpExists){
            if(otpData[email] === req.body.otp){
                const privateKey = decryptPrivateKey(userData.private_key,userData.salt)
                const payload = {user_id:userData.user_id,username:userData.username,email:userData.email}
                const accessToken = generateAccessToken(payload)
                const refreshToken = generateRefreshToken(payload)

                res.cookie('refreshToken',refreshToken,{
                    httpOnly: true,
                    secure: false, // TODO change to true in Prod
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                })
                res.json({
                    success: true,
                    accessToken,
                    privateKey,
                    publicKey:userData.public_key
                });
                delete otpData[email]
                return true;
            }else{
                res.json({
                    success:false,
                    message:'Invalid OPT. Please Enter Correct One',
                })
                return true;
            }
        }
    }catch (e) {
        const error = e as Error;
        console.log(error.stack)
        throw new Error(`Error Validating OTP ${e}`)
    }
}

function sendOTPEmail(concatenatedSalts:string,userEmail:string,userName:string){
    // Configure the transporter
    const date = new Date().getFullYear()

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'gynanrudr0@gmail.com',
            pass: 'degp cwmo igqd ikyc' // Be cautious with app passwords
        }
    });


    // Email details
    const mailOptions = {
        from: 'gynanrudr0@gmail.com',
        to: 'samd11.2.2005@gmail.com', // Receiver address TODO change to userEmail after testing
        subject: 'One time password - Your ticket to the world of secrecy', // Subject line
        html:
            `
            `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error while sending email: ', error);
        }
        console.log('Email sent: ' + info.response);
    });
}

export {validateOtp,sendOTPEmail};
