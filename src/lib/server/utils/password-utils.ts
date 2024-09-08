/* src : https://lord.technology/2024/02/21/hashing-passwords-on-cloudflare-workers.html */
/* can't use bcrypt or argon2 since im planning on deploying to cf pages free plan and the cpu time limit */
/* is not enough for password hashing with those two algos */

export async function hashPassword(
  password: string,
  providedSalt?: Uint8Array
): Promise<string> {
  const encoder = new TextEncoder();
  // Use provided salt if available, otherwise generate a new one
  const salt = providedSalt || crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
  const exportedKey = (await crypto.subtle.exportKey(
    "raw",
    key
  )) as ArrayBuffer;
  const hashBuffer = new Uint8Array(exportedKey);
  const hashArray = Array.from(hashBuffer);
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(
  storedHash: string,
  passwordAttempt: string
): Promise<boolean> {
  const [saltHex, originalHash] = storedHash.split(":");
  const matchResult = saltHex.match(/.{1,2}/g);
  if (!matchResult) {
    throw new Error("Invalid salt format");
  }
  const salt = new Uint8Array(matchResult.map((byte) => parseInt(byte, 16)));
  const attemptHashWithSalt = await hashPassword(passwordAttempt, salt);
  const [, attemptHash] = attemptHashWithSalt.split(":");
  return attemptHash === originalHash;
}

export function generateRandomString(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
