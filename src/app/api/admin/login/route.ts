import { NextResponse } from 'next/server';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@bitsathy.ac.in";
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Invalid admin credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token with admin role
    const token = await signToken({
      id: "admin",
      role: "admin",
      teamId: "admin"
    });

    // Create the response and set the cookie
    const response = NextResponse.json({ success: true }, { status: 200 });
    
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    });

    return response;
  } catch (error: any) {
    console.error("Admin Login Error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
