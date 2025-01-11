// path: src/lib/utils/encryption.ts

import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || ''; // Must be 32 characters
const IV_LENGTH = 16; // Initialization vector length

// Function to encrypt data
export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    if (ENCRYPTION_KEY.length !== 32 || ENCRYPTION_KEY === '') {
        throw new Error('Encryption key must be 32 characters');
    }
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

// Function to decrypt data
export function decrypt(text: string): string {
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encryptedText = Buffer.from(parts[1], 'hex');
    if (ENCRYPTION_KEY.length !== 32 || ENCRYPTION_KEY === '') {
        throw new Error('Encryption key must be 32 characters');
    }
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}


// Function to hash email using SHA-256
export function hashEmail(email: string): string {
    return crypto.createHash('sha256').update(email).digest('hex');
}