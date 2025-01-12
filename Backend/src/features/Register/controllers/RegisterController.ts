// Controller for Register
import { Request, Response } from 'express';
import crypto from 'crypto'

export const renderRegister = (req:Request, res:Response) => {
    res.send('Render Register page here');
};

export const handelRegister = (req:Request, res:Response) => {

    console.log(req.body)

    const hashPassword = (password:string) => {
        return crypto.createHash('sha256').update(password).digest('hex')
    }

    const password = hashPassword(req.body.password)
    console.log(password)

    res.json({success:false,message:'Failed'})
}