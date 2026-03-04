import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV = process.env.ENCRYPTION_IV;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be exactly 32 characters');
}

if (!IV || IV.length !== 16) {
  throw new Error('ENCRYPTION_IV must be exactly 16 characters');
}

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(encryptedText: string): string {
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, IV);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function encryptFinancialData(data: any): any {
  if (!data) return data;

  const sensitiveFields = ['budget', 'totalBudget', 'profit', 'trueProfit'];
  const encrypted: any = { ...data };

  for (const field of sensitiveFields) {
    if (encrypted[field] !== undefined && encrypted[field] !== null) {
      encrypted[field] = encrypt(String(encrypted[field]));
    }
  }

  return encrypted;
}

export function decryptFinancialData(data: any): any {
  if (!data) return data;

  const sensitiveFields = ['budget', 'totalBudget', 'profit', 'trueProfit'];
  const decrypted: any = { ...data };

  for (const field of sensitiveFields) {
    if (decrypted[field] !== undefined && decrypted[field] !== null) {
      try {
        decrypted[field] = parseFloat(decrypt(String(decrypted[field])));
      } catch (error) {
        console.error(`Error decrypting field ${field}:`, error);
      }
    }
  }

  return decrypted;
}
