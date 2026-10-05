import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { title, description, domain, difficulty } = data

    if (!title || !description || !domain || !difficulty) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const problem = await prisma.problemStatement.create({
      data: {
        title,
        description,
        domain,
        difficulty
      }
    })

    return NextResponse.json({ success: true, problem })
  } catch (error: any) {
    console.error("Failed to create problem:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: "Missing problem ID" }, { status: 400 })
    }

    await prisma.problemStatement.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete problem:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
