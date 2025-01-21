import CryptoJS from "crypto-js";

export default function decryptPrivateKey(encryptedKey: string, password: string): string {
    // Decrypt the encrypted private key
    const bytes = CryptoJS.AES.decrypt(encryptedKey, password);

    // Convert the decrypted data to a UTF-8 string
    const decryptedKey = bytes.toString(CryptoJS.enc.Utf8);

    if (!decryptedKey) {
        throw new Error("Decryption failed: Invalid password or corrupted data");
    }

    return decryptedKey;
}