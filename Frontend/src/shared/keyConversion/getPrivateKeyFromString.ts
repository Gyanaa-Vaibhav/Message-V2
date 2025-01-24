// Helper function to import a PEM private key
export default async function getPrivateKeyFromString(pemKey: string): Promise<CryptoKey> {
    // Remove PEM formatting
    const pemHeader = "-----BEGIN PRIVATE KEY-----";
    const pemFooter = "-----END PRIVATE KEY-----";

    const pemContents = pemKey
        .replace(pemHeader, "") // replace pemHeader with ""
        .replace(pemFooter, "") // replace pemFooter with ""
        .replace(/\s/g, '');  // Remove whitespace

    // Convert Base64 to ArrayBuffer
    const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0)).buffer;

    // Import key
    return await crypto.subtle.importKey(
        "spki", // SubjectPublicKeyInfo format for RSA public keys
        binaryDer,
        {
            name: "RSA-OAEP",
            hash: "SHA-256"
        },
        false,  // Non-extractable
        ["encrypt"] // Key usage
    );
}