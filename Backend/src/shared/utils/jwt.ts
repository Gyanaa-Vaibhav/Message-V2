import jwt from 'jsonwebtoken'
import {NextFunction, Request, Response} from "express";

interface DecodedJWT {
    user: string,
    userId: number,
    iat: number,
    exp: number
}

function sign(req:Request, res:Response, next:NextFunction){
    const token = jwt.sign({user:'Bob',userId:2},'Hello',{ expiresIn: '12hr' })
    console.log(token)
    let toSend = ''
    req.body.token = token
    next()
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
        req.body.user = jwt.verify(token, 'Hello') as DecodedJWT;
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