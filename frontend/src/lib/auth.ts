import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET || "super_secret_devops_hackathon_key_2026"
const encodedKey = new TextEncoder().encode(secretKey)

export async function signToken(payload: any, expiresIn: string = '24h') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey)
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, encodedKey)
    return payload
  } catch (err: any) {
    console.log("[verifyToken] Error:", err.message)
    return null
  }
}
