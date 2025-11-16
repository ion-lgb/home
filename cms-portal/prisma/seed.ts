import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { defaultContent } from "@/lib/defaultContent";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.siteContent.upsert({
    where: { id: 1 },
    update: { data: defaultContent },
    create: { id: 1, data: defaultContent }
  });

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, displayName: "Administrator" },
    create: {
      email,
      passwordHash,
      displayName: "Administrator"
    }
  });

  console.log("Seed data inserted. Default admin:", email, password);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
