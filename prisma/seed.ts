import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import { ArgentinaProvince } from "../app/generated/prisma/enums";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const ALL_PROVINCES: ArgentinaProvince[] = [
  "BUENOS_AIRES",
  "CABA",
  "CATAMARCA",
  "CHACO",
  "CHUBUT",
  "CORDOBA",
  "CORRIENTES",
  "ENTRE_RIOS",
  "FORMOSA",
  "JUJUY",
  "LA_PAMPA",
  "LA_RIOJA",
  "MENDOZA",
  "MISIONES",
  "NEUQUEN",
  "RIO_NEGRO",
  "SALTA",
  "SAN_JUAN",
  "SAN_LUIS",
  "SANTA_CRUZ",
  "SANTA_FE",
  "SANTIAGO_DEL_ESTERO",
  "TIERRA_DEL_FUEGO",
  "TUCUMAN",
];

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (email && password) {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.admin.upsert({
      where: { email },
      update: { passwordHash },
      create: { email, passwordHash },
    });
    console.log(`Admin seeded: ${email}`);
  } else {
    console.warn(
      "ADMIN_EMAIL / ADMIN_PASSWORD not set — skipping admin seed."
    );
  }

  for (const province of ALL_PROVINCES) {
    await prisma.shippingProvinceConfig.upsert({
      where: { province },
      update: {},
      create: { province, basePrice: 0 },
    });
  }
  console.log(`Seeded ${ALL_PROVINCES.length} shipping province rows.`);

  const existingRule = await prisma.shippingSurchargeRule.findFirst();
  if (!existingRule) {
    await prisma.shippingSurchargeRule.create({
      data: { thresholdKg: 5, surchargePct: 15, active: true },
    });
    console.log("Seeded default shipping surcharge rule.");
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
