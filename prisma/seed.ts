import "dotenv/config";
import {
  PrismaClient,
  Role,
  JobType,
  SubscriptionPlan,
  SubscriptionStatus,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding...");

  // --- Clean up existing data (order matters due to FK constraints) ---
  await prisma.subscription.deleteMany();
  await prisma.job.deleteMany();
  await prisma.company.deleteMany();
  await prisma.user.deleteMany();

  // --- Users ---
  const employer = await prisma.user.create({
    data: {
      name: "Budi Santoso",
      email: "budi@employer.com",
      role: Role.EMPLOYER,
    },
  });

  const candidate = await prisma.user.create({
    data: {
      name: "Siti Rahayu",
      email: "siti@candidate.com",
      role: Role.CANDIDATE,
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin Platform",
      email: "admin@remotejobs.com",
      role: Role.ADMIN,
    },
  });

  // --- Subscription ---
  await prisma.subscription.create({
    data: {
      userId: employer.id,
      plan: SubscriptionPlan.PREMIUM_POSTER,
      status: SubscriptionStatus.ACTIVE,
      currentPeriodStart: new Date(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 days
    },
  });

  await prisma.subscription.create({
    data: {
      userId: candidate.id,
      plan: SubscriptionPlan.FREE,
      status: SubscriptionStatus.ACTIVE,
    },
  });

  // --- Company ---
  const company = await prisma.company.create({
    data: {
      name: "TechNusa Indonesia",
      slug: "technusa-indonesia",
      logoUrl: "https://placehold.co/100x100?text=TN",
      website: "https://technusa.id",
      description: "Perusahaan teknologi terkemuka dari Indonesia.",
      userId: employer.id,
    },
  });

  const company2 = await prisma.company.create({
    data: {
      name: "RemoteWorks Global",
      slug: "remoteworks-global",
      website: "https://remoteworks.io",
      description: "Remote-first company focused on global talent.",
      userId: employer.id,
    },
  });

  // --- Jobs ---
  await prisma.job.createMany({
    data: [
      {
        title: "Senior Full Stack Engineer",
        slug: "senior-full-stack-engineer-technusa",
        description:
          "Membangun produk SaaS skala besar dengan Next.js dan Node.js.",
        type: JobType.FULL_TIME,
        category: "Software Engineering",
        region: "Asia",
        salaryMin: 15000000,
        salaryMax: 25000000,
        currency: "IDR",
        isFeatured: true,
        featuredUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        companyId: company.id,
      },
      {
        title: "Frontend Developer (React)",
        slug: "frontend-developer-react-technusa",
        description:
          "Membuat UI yang indah dan performant dengan React dan Tailwind.",
        type: JobType.FULL_TIME,
        category: "Software Engineering",
        region: "Worldwide",
        salaryMin: 8000000,
        salaryMax: 15000000,
        currency: "IDR",
        companyId: company.id,
      },
      {
        title: "Product Marketing Manager",
        slug: "product-marketing-manager-remoteworks",
        description: "Drive go-to-market strategy for our SaaS products.",
        type: JobType.FULL_TIME,
        category: "Marketing",
        region: "US Only",
        salaryMin: 5000,
        salaryMax: 8000,
        currency: "USD",
        isFeatured: true,
        featuredUntil: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        companyId: company2.id,
      },
      {
        title: "UI/UX Design Intern",
        slug: "uiux-design-intern-technusa",
        description: "Belajar dan berkontribusi pada desain produk kami.",
        type: JobType.INTERNSHIP,
        category: "Design",
        region: "Asia",
        currency: "IDR",
        companyId: company.id,
      },
      {
        title: "Backend Engineer (Contract)",
        slug: "backend-engineer-contract-remoteworks",
        description: "Build and maintain REST APIs using Go and PostgreSQL.",
        type: JobType.CONTRACT,
        category: "Software Engineering",
        region: "Worldwide",
        salaryMin: 3000,
        salaryMax: 5000,
        currency: "USD",
        companyId: company2.id,
      },
    ],
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
