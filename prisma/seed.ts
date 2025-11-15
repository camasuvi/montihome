import { PrismaClient, Difficulty, AgeRange, MaterialsLevel } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Ensure SiteSettings exists
  await prisma.siteSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, isPublic: false }
  });

  // Sample activities
  const activitiesData = [
    {
      ageRange: AgeRange.AGE_12_18M,
      durationMinutes: 10,
      difficulty: Difficulty.EASY,
      primaryCategory: 'Practical Life',
      categories: ['Practical Life'],
      tags: ['Fine Motor', 'Independence'],
      materialsLevel: MaterialsLevel.HOUSEHOLD,
      translations: {
        create: [
          {
            languageCode: 'en',
            title: 'Posting Pom-Poms',
            shortDescription: 'Place pom-poms into a container with a hole.',
            description:
              'A simple fine-motor activity to develop hand-eye coordination and concentration.',
            materials: ['Small pom-poms', 'Container with hole'],
            steps: [
              'Place the container in front of the child.',
              'Demonstrate placing a pom-pom into the hole.',
              'Invite the child to try.'
            ],
            goal: 'Develop fine motor control and concentration.',
            tips: ['Start with larger holes and larger items.'],
            variations: ['Use a spoon to transfer.'],
            safetyNotes: 'Supervise to avoid mouthing small items.'
          },
          {
            languageCode: 'tr',
            title: 'Ponpon Yerleştirme',
            shortDescription: 'Ponponları delikli bir kaba yerleştirme.',
            description:
              'El-göz koordinasyonu ve konsantrasyon geliştirmek için basit bir ince motor etkinliği.',
            materials: ['Küçük ponponlar', 'Delikli kap'],
            steps: [
              'Kabı çocuğun önüne koyun.',
              'Ponponu deliğe yerleştirmeyi gösterin.',
              'Çocuğu denemeye davet edin.'
            ],
            goal: 'İnce motor kontrol ve konsantrasyon geliştirmek.',
            tips: ['Daha büyük delikler ve daha büyük nesnelerle başlayın.'],
            variations: ['Kaşıkla transfer yapın.'],
            safetyNotes: 'Küçük parçaları ağza götürmemesi için gözlemleyin.'
          }
        ]
      }
    },
    {
      ageRange: AgeRange.AGE_3_4Y,
      durationMinutes: 20,
      difficulty: Difficulty.MEDIUM,
      primaryCategory: 'Sensorial',
      categories: ['Sensorial', 'Art & Creativity'],
      tags: ['Order', 'Concentration'],
      materialsLevel: MaterialsLevel.SIMPLE_SUPPLIES,
      translations: {
        create: [
          {
            languageCode: 'en',
            title: 'Color Grading Cards',
            shortDescription: 'Arrange color shades from light to dark.',
            description: 'Develops visual discrimination using shades of color.',
            materials: ['Color cards (different shades)'],
            steps: [
              'Lay out the darkest and lightest cards.',
              'Sort remaining cards between them from dark to light.'
            ],
            goal: 'Refine visual discrimination and order.',
            tips: ['Start with fewer shades.'],
            variations: ['Try with fabric swatches.']
          }
        ]
      }
    }
  ];

  for (const data of activitiesData) {
    await prisma.activity.create({ data });
  }

  // Sample guides
  const guidesData = [
    {
      slug: 'montessori-101',
      category: 'Montessori101',
      published: true,
      translations: {
        create: [
          {
            languageCode: 'en',
            title: 'Montessori 101',
            summary: 'An introduction to Montessori philosophy.',
            content:
              'Montessori is a child-centered approach focusing on independence and respect...'
          },
          {
            languageCode: 'tr',
            title: 'Montessori 101',
            summary: 'Montessori felsefesine giriş.',
            content:
              'Montessori, bağımsızlık ve saygıya odaklanan çocuk merkezli bir yaklaşımdır...'
          }
        ]
      }
    },
    {
      slug: 'prepared-environment-at-home',
      category: 'PreparedEnvironment',
      published: true,
      translations: {
        create: [
          {
            languageCode: 'en',
            title: 'Prepared Environment at Home',
            summary: 'Set up your home to foster independence.',
            content:
              'A prepared environment is orderly, accessible and scaled to the child...'
          },
          {
            languageCode: 'tr',
            title: 'Evde Hazırlanmış Ortam',
            summary: 'Bağımsızlığı destekleyen ev düzeni.',
            content:
              'Hazırlanmış bir ortam düzenli, erişilebilir ve çocuğa göre ölçeklidir...'
          }
        ]
      }
    }
  ];

  for (const data of guidesData) {
    await prisma.guide.create({ data });
  }

  console.log('Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


