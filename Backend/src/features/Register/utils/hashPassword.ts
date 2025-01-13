import crypto from "crypto";

const hashPassword = (password:string,hash:string) => {
    return crypto.createHash('sha256').update(password+hash).digest('hex')
}

export {hashPassword}