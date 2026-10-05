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

export async function PATCH(request: Request) {
  try {
    const data = await request.json();
    
    const parseDate = (val: any) => {
      if (!val) return undefined;
      const d = new Date(val);
      return isNaN(d.getTime()) ? undefined : d;
    };

    const validData: any = {};
    if (data.hackathonName !== undefined) validData.hackathonName = data.hackathonName;
    if (data.maxTeams !== undefined) validData.maxTeams = parseInt(data.maxTeams);
    if (data.contactAddress !== undefined) validData.contactAddress = data.contactAddress;
    
    // Dates
    if (parseDate(data.hackathonStart)) validData.hackathonStart = parseDate(data.hackathonStart);
    if (parseDate(data.hackathonEnd)) validData.hackathonEnd = parseDate(data.hackathonEnd);
    if (parseDate(data.registrationStart)) validData.registrationStart = parseDate(data.registrationStart);
    if (parseDate(data.registrationEnd)) validData.registrationEnd = parseDate(data.registrationEnd);
    if (parseDate(data.selectionStart)) validData.selectionStart = parseDate(data.selectionStart);
    if (parseDate(data.selectionEnd)) validData.selectionEnd = parseDate(data.selectionEnd);

    // Contacts
    if (data.facultyName !== undefined) validData.facultyName = data.facultyName;
    if (data.facultyEmail !== undefined) validData.facultyEmail = data.facultyEmail;
    if (data.facultyPhone !== undefined) validData.facultyPhone = data.facultyPhone;
    
    if (data.org1Name !== undefined) validData.org1Name = data.org1Name;
    if (data.org1Email !== undefined) validData.org1Email = data.org1Email;
    if (data.org1Phone !== undefined) validData.org1Phone = data.org1Phone;
    
    if (data.org2Name !== undefined) validData.org2Name = data.org2Name;
    if (data.org2Email !== undefined) validData.org2Email = data.org2Email;
    if (data.org2Phone !== undefined) validData.org2Phone = data.org2Phone;

    const updatedConfig = await prisma.hackathonConfig.upsert({
      where: { id: "default" },
      update: validData,
      create: {
        id: "default",
        ...validData
      }
    });

    return NextResponse.json({ success: true, config: updatedConfig });
  } catch (error: any) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
