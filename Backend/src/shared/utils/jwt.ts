import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import {Request,Response,NextFunction} from "express";
interface DecodedJWT {
    user: string,
    userId: number,
    iat: number,
    exp: number
}

function sign(req:Request, res:Response, next:NextFunction){
    const token = jwt.sign({user:'bob',userId:1},'Hello',{ expiresIn: '12hr' })
    let toSend = ''
    req.body.token = token
    setTimeout(()=>{
        next()
    },100)
}

function decode(req:Request,res:Response,next:NextFunction){
    const token = req.body.token
    const verified = jwt.verify(token,'Hello')
    const decode = jwt.decode(token) as DecodedJWT
    if(!decode) return
    req.body.user = decode.user
    next()
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.status(401).json({
            success: false,
            error: 'Authorization token missing or malformed',
        });
        return
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, 'Hello') as DecodedJWT;
        req.body.user = decoded;
        next();
    } catch (err: any) {
        if (err.name === 'TokenExpiredError') {
            res.status(401).json({
                success: false,
                error: 'Token has expired',
            });
            return
        }
        res.status(401).json({
            success: false,
            error: 'Invalid token',
        });
        return;
    }
}

export {sign,decode,verifyToken}