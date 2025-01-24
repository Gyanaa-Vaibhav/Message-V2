import cryptoRandomString from "crypto-random-string";
import CryptoJS from "crypto-js";

export default function encryptMessage(outGoingMessage:string){
    // Random Salt
    const random_Secret_Key = cryptoRandomString({length: 25, type: 'ascii-printable'})

    // Returns Encrypted message as string to convert in to share and save in Data base
    return CryptoJS.AES.encrypt(outGoingMessage, random_Secret_Key).toString();
}
