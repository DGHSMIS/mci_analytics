import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // List of diseases to seed
  const diseases = [
    { name: 'Bronchial Asthma' },
    { name: 'Congenital Heart Diseases' },
    { name: 'Epilepsy' },
    { name: 'Type 1 Diabetes Mellitus' },
    { name: 'Thalassemia and iron deficiency anemia' },
    { name: 'Nephrotic Syndrome' },
  ];

  // Seed diseases using upsert to avoid duplicates
  for (const disease of diseases) {
    await prisma.disease.upsert({
      where: { name: disease.name },
      update: {},
      create: {
        name: disease.name,
      },
    });
  }

  console.log('Disease seeding completed.');
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
