import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const config = await prisma.hackathonConfig.findUnique({ where: { id: "default" } });
    const now = new Date();
    
    // Check if hackathon has started
    if (config && now < config.hackathonStart) {
      return NextResponse.json({ locked: true, startsAt: config.hackathonStart });
    }

    const problems = await prisma.problemStatement.findMany({
      include: { selection: true }
    });

    return NextResponse.json({ 
      locked: false, 
      problems: problems.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        domain: p.domain,
        difficulty: p.difficulty,
        status: p.selection ? "SELECTED" : "AVAILABLE",
        selectedByTeamId: p.selection?.teamId || null
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch problem statements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    const token = req.headers.get("cookie")?.split("; ").find(row => row.startsWith("auth_token="))?.split("=")[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const payload = await verifyToken(token);
    if (!payload || !payload.teamId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { problemId } = await req.json();

    // 2. Check timing
    const config = await prisma.hackathonConfig.findUnique({ where: { id: "default" } });
    if (config && new Date() < config.hackathonStart) {
      return NextResponse.json({ error: "Problem statements are locked until the hackathon begins." }, { status: 403 });
    }
    if (config && new Date() > config.hackathonEnd) {
      return NextResponse.json({ error: "The hackathon has ended. This action is no longer available." }, { status: 403 });
    }

    // 3. Atomically select problem statement
    // Using Prisma transaction for atomic check and insertion
    const result = await prisma.$transaction(async (tx) => {
      // Check if team already selected a problem
      const existingSelection = await tx.problemSelection.findUnique({ where: { teamId: payload.teamId as string } });
      if (existingSelection) {
        throw new Error("Your team has already selected a problem statement.");
      }

      // Check if problem is already selected
      const problemSelection = await tx.problemSelection.findUnique({ where: { problemStatementId: problemId } });
      if (problemSelection) {
        throw new Error("This problem statement has just been selected by another team. Please choose another available problem.");
      }

      // Attempt creation (relies on database UNIQUE constraints)
      const newSelection = await tx.problemSelection.create({
        data: {
          problemStatementId: problemId,
          teamId: payload.teamId as string
        }
      });
      return newSelection;
    }, { isolationLevel: 'Serializable' });

    return NextResponse.json({ success: true, selection: result });
  } catch (error: any) {
    // Handle Prisma unique constraint violation specifically (P2002)
    if (error.code === 'P2002') {
       return NextResponse.json({ error: "This problem statement has just been selected by another team. Please choose another available problem." }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || "Failed to select problem" }, { status: 400 });
  }
}
