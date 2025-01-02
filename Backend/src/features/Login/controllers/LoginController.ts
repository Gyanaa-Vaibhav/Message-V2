// Controller for Login
import { Request, Response } from 'express';

export const renderLogin = (req: Request, res: Response) => {
    res.send('Render Login page here');
};
