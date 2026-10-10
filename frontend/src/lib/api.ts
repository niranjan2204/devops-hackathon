const isServer = typeof window === "undefined";

export const API_BASE_URL =
  (isServer && process.env.INTERNAL_API_URL)
    ? process.env.INTERNAL_API_URL
    : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");
