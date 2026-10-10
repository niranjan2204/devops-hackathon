const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const existingTeam = await prisma.team.findUnique({
    where: { teamId: 'DVH-999' }
  });

  if (!existingTeam) {
    await prisma.team.create({
      data: {
        teamId: 'DVH-999',
        teamName: 'Demo Alpha Team',
        passwordHash,
        members: {
          create: [
            {
              name: 'John Doe (Leader)',
              registerNumber: 'REG-001',
              email: 'leader@demo.com',
              phone: '9876543210',
              isLeader: true
            },
            { name: 'Member Two', registerNumber: 'REG-002', email: 'm2@demo.com', isLeader: false },
            { name: 'Member Three', registerNumber: 'REG-003', email: 'm3@demo.com', isLeader: false },
            { name: 'Member Four', registerNumber: 'REG-004', email: 'm4@demo.com', isLeader: false },
          ]
        }
      }
    });
    console.log("Dummy team created! Login with Team ID: DVH-999 and Password: password123");
  } else {
    console.log("Dummy team already exists! Login with Team ID: DVH-999 and Password: password123");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
