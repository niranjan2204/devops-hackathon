const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function list() {
  const teams = await prisma.team.findMany({ include: { members: true } });
  console.log(JSON.stringify(teams, null, 2));
}
list().finally(() => prisma.$disconnect());
