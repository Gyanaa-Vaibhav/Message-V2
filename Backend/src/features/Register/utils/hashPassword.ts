import crypto from "crypto";

const hashPassword = (password:string,hash:string) => {
    return crypto.createHash('sha256').update(password+hash).digest('hex')
}

const hashPrivateKey = (key:string,salt:string) => {
    return crypto.createHash('sha256').update(key+salt).digest('hex')
}

export {hashPassword,hashPrivateKey}