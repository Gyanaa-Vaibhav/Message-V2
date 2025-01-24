import {getPublicKeyFromString} from "../keyConversion/keyConversionExport.ts";

// Encrypts the message
export default async function encryptWithPublicKey(pemPublicKey:string,encryptedMessage:string){

    // Converts the key from PEM to Crypto Key
    const publicKey = await getPublicKeyFromString(pemPublicKey);

    // Encodes message to Buffer to allow Encryption
    const encodedMessageToBufferSource = new TextEncoder().encode(encryptedMessage);

    return await crypto.subtle.encrypt(
        {name: "RSA-OAEP"},
        publicKey,
        encodedMessageToBufferSource
    );
}
