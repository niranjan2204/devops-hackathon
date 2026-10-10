const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function update() {
  const passwordHash = await bcrypt.hash('password', 10);
  await prisma.team.update({
    where: { teamId: 'DVH-999' },
    data: { passwordHash }
  });
  console.log("Updated password to 'password'");
}

update().finally(() => prisma.$disconnect());
