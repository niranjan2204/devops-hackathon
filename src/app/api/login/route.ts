import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and Password are required." }, { status: 400 });
    }

    const leader = await prisma.teamMember.findUnique({
      where: { email },
      include: { team: true }
    });

    if (!leader || !leader.isLeader || !leader.team) {
      return NextResponse.json({ error: "Invalid Email or Password." }, { status: 401 });
    }

    const team = leader.team;

    if (team.status === "PENDING") {
      return NextResponse.json({ error: "Your team is pending Admin approval." }, { status: 403 });
    }

    const passwordMatch = await bcrypt.compare(password, team.passwordHash);
    
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid Email or Password." }, { status: 401 });
    }

    const token = await signToken({ teamId: team.id, role: 'team_leader' });

    const response = NextResponse.json({ success: true, teamId: team.teamId });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "An error occurred during login." }, { status: 500 });
  }
}
