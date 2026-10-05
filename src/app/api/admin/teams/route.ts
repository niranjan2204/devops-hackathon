import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const teams = await prisma.team.findMany({
      include: {
        members: true,
        problemSelection: {
          include: { problemStatement: true }
        }
      },
      orderBy: { registeredAt: 'desc' }
    });
    return NextResponse.json({ success: true, teams });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { teamId, status } = await request.json();
    
    if (!teamId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedTeam = await prisma.team.update({
      where: { id: teamId },
      data: { status }
    });

    return NextResponse.json({ success: true, team: updatedTeam });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { teamId } = await request.json();
    
    if (!teamId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Delete related records first to satisfy foreign key constraints
    await prisma.$transaction([
      prisma.teamMember.deleteMany({ where: { teamId } }),
      prisma.problemSelection.deleteMany({ where: { teamId } }),
      prisma.team.delete({ where: { id: teamId } })
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
