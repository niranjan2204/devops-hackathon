import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teamName, leader, members, password } = body;

    if (!teamName || !leader || !members || members.length !== 3 || !password) {
      return NextResponse.json({ error: "Invalid registration data. Ensure 4 members are provided." }, { status: 400 });
    }

    // Step 1: Check total teams limit (Race condition mitigated by serializable transaction)
    // Actually, SQLite transactions in Prisma support SERIALIZABLE isolation by default on writes.
    
    // We will do everything inside an interactive transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if max teams reached
      const config = await tx.hackathonConfig.findUnique({ where: { id: "default" } });
      const maxTeams = config?.maxTeams || 50;
      
      const currentTeamsCount = await tx.team.count();
      if (currentTeamsCount >= maxTeams) {
        throw new Error("Registration is currently full. All team slots have been filled.");
      }

      // 2. Check if team name exists
      const existingTeam = await tx.team.findUnique({ where: { teamName } });
      if (existingTeam) {
        throw new Error("This team name is already registered. Please choose another name.");
      }

      // 3. Check for duplicate students (email or registerNumber) across all members
      const allMembers = [leader, ...members];
      const emails = allMembers.map(m => m.email);
      const registerNumbers = allMembers.map(m => m.registerNumber);

      // Are there duplicates within the submitted form itself?
      if (new Set(emails).size !== emails.length || new Set(registerNumbers).size !== registerNumbers.length) {
         throw new Error("Duplicate email or register number found within the team.");
      }

      const existingStudents = await tx.teamMember.findMany({
        where: {
          OR: [
            { email: { in: emails } },
            { registerNumber: { in: registerNumbers } }
          ]
        }
      });

      if (existingStudents.length > 0) {
        throw new Error(`Student ${existingStudents[0].name} (${existingStudents[0].registerNumber}) is already registered with another team.`);
      }

      // 4. Hash password and generate Team ID
      const passwordHash = await bcrypt.hash(password, 10);
      const newTeamId = `DVH-${(currentTeamsCount + 1).toString().padStart(3, '0')}`;

      // 5. Create Team and Members
      const team = await tx.team.create({
        data: {
          teamId: newTeamId,
          teamName,
          passwordHash,
          members: {
            create: [
              { ...leader, isLeader: true },
              ...members.map((m: any) => ({ ...m, isLeader: false }))
            ]
          }
        }
      });

      return team;
    }, {
      isolationLevel: 'Serializable'
    });

    return NextResponse.json({ success: true, team: { teamId: result.teamId, teamName: result.teamName } });

  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "An error occurred during registration." }, { status: 400 });
  }
}
