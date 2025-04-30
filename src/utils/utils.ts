export const generateVerificationCode = (): string => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
}

import { v4 as uuidv4 } from 'uuid';

export const generateHash = (): string => {
    const hash = uuidv4().replace(/-/g, ''); // Remove dashes from UUID
    return hash.substring(0, 16); // Return the first 16 characters
}
