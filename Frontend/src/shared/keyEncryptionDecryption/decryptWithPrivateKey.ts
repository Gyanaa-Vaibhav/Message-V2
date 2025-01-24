import {getPrivateKeyFromString} from "../keyConversion/keyConversionExport.ts";

// Decrypts and returns String as Promise
export default async function decryptWithPrivateKey(encryptedMessage:string, pemPrivateKey:string):Promise<string> {

    // Converts the key from PEM to Crypto Key
    const privateKey = await getPrivateKeyFromString(pemPrivateKey);

    // Encodes message to Buffer to allow Decryption
    const encodedMessageToBufferSource = new TextEncoder().encode(encryptedMessage)

    // Decrypts and returns data in Buffer
    const decryptedKey = await crypto.subtle.decrypt(
        { name: "RSA-OAEP" },
        privateKey,
        encodedMessageToBufferSource
    );

    // Convert to String
    return new TextDecoder().decode(decryptedKey);
}