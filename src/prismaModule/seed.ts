import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await userSeed();
}
async function userSeed() {
  await prisma.users.deleteMany();
  const existingUser = await prisma.users.findFirst({
    where: {
      OR: [{ userName: 'admin-serre' }, { userName: 'sudo-serre' }],
    },
  });

  if (!existingUser) {
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    const hashedSudoPassword = await bcrypt.hash('sudo1234', 10);

    await prisma.users.createMany({
      data: [
        {
          password: hashedPassword,
          userName: 'admin-serre',
          role: UserRole.ADMIN,
          phoneNumber: '+22790909090',
          firstName: 'admin',
          lastName: 'principal',
        },
        {
          password: hashedSudoPassword,
          userName: 'sudo-serre',
          role: UserRole.SUDO,
          phoneNumber: '+22791919191',
          firstName: 'sudo',
          lastName: 'principal',
        },
      ],
    });
    console.log('Utilisateurs administrateur et sudo créés avec succès.');
  } else {
    console.log('Utilisateur déjà existant.');
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
