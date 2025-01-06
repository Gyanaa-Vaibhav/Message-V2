import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';
import {Request,Response,NextFunction} from "express";

function sign(req:Request,res:Response,next:NextFunction){
    const token = jwt.sign({user:'testName',userId:1},'Hello',{ expiresIn: '30min' })
    let toSend = ''
    // async function hashPass(){
    //     const pass = await bcrypt.hash('test',10)
    //     // console.log("Hashed",pass)
    //     toSend += pass
    // }
    // hashPass().then(()=>req.body.pass = toSend)

    req.body.token = token
    setTimeout(()=>{
        next()
    },100)
}


function decode(req:Request,res:Response,next:NextFunction){
    const token = req.body.token
    console.log('Token',token)
    const verified = jwt.verify(token,'Hello')
    const decode = jwt.decode(token)
    console.log("Decoded",decode)
    next()
}

export {sign,decode}