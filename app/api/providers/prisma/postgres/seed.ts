import prismaPostGresClient from '@api/providers/prisma/postgres/prismaPostGresClient';


async function main() {
  // List of diseases to seed
  const diseases = [
    { conceptName: 'Bronchial Asthma', conceptUuId:"e186fc2b-e424-4a9a-9e54-ce3f544a017a" },
    { conceptName: 'Congenital Heart Disease', conceptUuId:"9659f074-b8fa-4305-af74-88e9677aca7f" },
    { conceptName: 'Epilepsy' , conceptUuId:"26d88776-8891-47ff-88f2-8f30c306f0ce"},
    { conceptName: 'Type 1 Diabetes Mellitus' , conceptUuId:"0dcee639-f054-42e6-b816-3e09116273f0"},
    { conceptName: 'Thalassemia and Iron Deficiency Anemia', conceptUuId:"6b3d3d81-c487-4608-af2c-d4fa4cdb6291" },
    { conceptName: 'Nephrotic Syndrome' , conceptUuId:"238e450e-4be2-4e3e-b96f-3090e7dd6915"},
  ];

  // Seed diseases using upsert to avoid duplicates
  for (const disease of diseases) {
    await prismaPostGresClient.disease.upsert({
      where: { conceptUuId: disease.conceptUuId },
      update: {},
      create: {
        conceptName: disease.conceptName,
        conceptUuId: disease.conceptUuId,
      },
    });
  }

  console.log('Disease seeding completed.');
}

main()
  .then(async () => {
    await prismaPostGresClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaPostGresClient.$disconnect();
    process.exit(1);
  });
