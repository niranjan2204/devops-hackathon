const isServer = typeof window === "undefined";

export const API_BASE_URL = isServer
  ? (process.env.INTERNAL_API_URL || "http://backend:5000")
  : (process.env.NEXT_PUBLIC_API_URL || "");
