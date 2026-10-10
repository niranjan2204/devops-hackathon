const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const team = await prisma.team.findUnique({
    where: { teamName: 'Tesseract' },
    include: { members: true }
  });
  console.log(JSON.stringify(team, null, 2));
}

check().catch(console.error).finally(() => prisma.$disconnect());
