import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit nonce for GCM
// const KEY_ENV = "JOURNAL_ENCRYPTION_KEY_B64";
const VERSION = 1;

export type EncryptedContent = {
  ciphertext: string;
  iv: string;
  authTag: string;
  version: number;
};

const getKey = () => {
  const keyBase64 = process.env.KEY_ENV;

  if (!keyBase64) {
    throw new Error(`KEY_ENV is not set`);
  }

  const key = Buffer.from(keyBase64, "base64");

  if (key.length !== 32) {
    throw new Error(`KEY_ENV must decode to 32 bytes (256-bit key)`);
  }

  return key;
};

export const encryptContent = (plaintext: string): EncryptedContent => {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    version: VERSION,
  };
};

export const decryptContent = (payload: EncryptedContent): string => {
  if (!payload || payload.version !== VERSION) {
    throw new Error("Unsupported encryption payload version");
  }

  const key = getKey();
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.authTag, "base64");
  const ciphertext = Buffer.from(payload.ciphertext, "base64");
  const decipher = createDecipheriv(ALGORITHM, key, iv);

  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
