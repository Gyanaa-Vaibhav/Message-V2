// Controller for Login
import { Request, Response } from 'express';

export const renderLogin = (req: Request, res: Response) => {
    res.json({success:true,message:'Render Login page here'});
};
