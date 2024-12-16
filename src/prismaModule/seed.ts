import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  await userSeed();
  await actionaireSeed();
}

async function userSeed() {
  await prisma.users.deleteMany();
  await prisma.serre.deleteMany();

  const hashedPassword = await bcrypt.hash('admin1234', 10);
  const hashedSudoPassword = await bcrypt.hash('sudo1234', 10);

  const user1 = await prisma.users.create({
    data: {
      password: hashedPassword,
      userName: 'admin-serre',
      role: UserRole.ADMIN,
      phoneNumber: '+22790909090',
      firstName: 'admin',
      lastName: 'principal',
    },
  });

  const user2 = await prisma.users.create({
    data: {
      password: hashedSudoPassword,
      userName: 'sudo-serre',
      role: UserRole.SUDO,
      phoneNumber: '+22791919191',
      firstName: 'sudo',
      lastName: 'principal',
    },
  });
  if (user1.id && user2.id) await defaultsSerreSeed([user1.id, user2.id]);

  console.log('Utilisateurs administrateur et sudo créés avec succès.');
}

async function actionaireSeed() {
  await prisma.capteur.deleteMany();
  await prisma.capteur.create({
    data: {
      S1: 'Pollinisateur',
      S2: 'Electrovanne 1',
      S3: 'Electrovanne 2',
      S4: 'Led UV',
      S5: 'Mag Lock 1',
      S6: 'Mag Lock 2',
      S7: 'Pad cooling',
      S8: 'Extracteur d’humidité',
      S9: 'Générateur',
      S10: 'Pompe à eau',
      S11: 'Moteur de déploiement',
      S12: 'Moteur de repliement',
      S13: 'Bipeur',
      S14: 'null',
      S15: 'null',
      S16: 'null',
    },
  });
}

async function defaultsSerreSeed(userIds: string[]) {
  await prisma.serre.deleteMany();
  await prisma.serre.create({
    data: {
      name: 'serre principale',
      protentaId: 'p1001',
      capteurId: 'c1001',
      users: {
        connect: userIds.map((id) => ({ id: id })),
      },
    },
  });
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
