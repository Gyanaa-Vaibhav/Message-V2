import jwt, {JwtPayload} from 'jsonwebtoken'
import {NextFunction, Request, Response} from "express";
import dotenv from 'dotenv'
dotenv.config();

interface DecodedJWT {
    user: string,
    userId: number,
    iat: number,
    exp: number
}

function sign(req:Request, res:Response, next:NextFunction){
    const token = jwt.sign({user:'Bob',userId:2},'Hello',{ expiresIn: '12hr' })
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
        const accessKey = process.env.ACCESS_SECRET;
        if(!accessKey) return;
        req.body.user = jwt.verify(token, accessKey) as DecodedJWT;
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

function refreshToken(req:Request,res:Response,next:NextFunction){
    try {
        const accessKey = process.env.ACCESS_SECRET;
        const refreshKey = process.env.REFRESH_SECRET;
        if (!accessKey || !refreshKey) {
            res.status(500).json({ success: false, error: 'Server configuration error' });
            return
        }

        const token = req.cookies.refreshToken;

        if (!token) {
            res.status(401).json({ success: false, error: 'Refresh token is missing' });
            return
        }

        const user = jwt.verify(token, refreshKey) as JwtPayload;
        const payload: Payload = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
        };
        const newAccessToken = jwt.sign(payload, accessKey, { expiresIn: '6h' });
        console.log(newAccessToken)
        req.body.user = user;

        res.status(200).json({ success: true, accessToken: newAccessToken });
        return

    } catch (error) {
        next(error);
    }
}

type Payload = {user_id:string,username:string,email:string}

// Generate access token (short-lived)
export function generateAccessToken(payload:Payload) {
    const accessKey = process.env.ACCESS_SECRET;
    if(!accessKey) return;
    return jwt.sign(payload, accessKey, { expiresIn: '6h' });
}

// Generate refresh token (long-lived)
export function generateRefreshToken(payload:Payload) {
    const refreshKey = process.env.REFRESH_SECRET;
    if(!refreshKey) return;
    return jwt.sign(payload, refreshKey, { expiresIn: '7d' });
}

export {sign,decode,verifyToken,refreshToken}