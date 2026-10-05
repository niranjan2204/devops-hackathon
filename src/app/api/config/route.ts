import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    let config = await prisma.hackathonConfig.findUnique({
      where: { id: "default" }
    });

    if (!config) {
      config = await prisma.hackathonConfig.create({
        data: { id: "default" }
      });
    }

    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
