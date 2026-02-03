import crypto from "crypto"

export class Auth {
  generateApiKey(secret: string) {
    return crypto.createHash("sha256").update(secret).digest("hex")
  }

  isValidApiKey(secret: string, apiKey: string) {
    return this.generateApiKey(secret) === apiKey
  }
}

export const auth = new Auth()
