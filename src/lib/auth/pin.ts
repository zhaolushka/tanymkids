/** SHA-256 hex digest for PIN storage (never store raw PIN). */
export async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(pin.trim());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function isValidPinFormat(pin: string): boolean {
  return /^\d{4,6}$/.test(pin.trim());
}
