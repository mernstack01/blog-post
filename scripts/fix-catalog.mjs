// Preview: node --env-file=.env scripts/fix-catalog.mjs
// Apply:   node --env-file=.env scripts/fix-catalog.mjs --apply
import { PrismaClient } from '@prisma/client';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const db = new PrismaClient();
const serviceSlugs = ['gisht-terish', 'tom-yopish'];
const products = [
  { slug: 'gisht', name: "G'isht", description: "Qurilish uchun g'isht" },
  { slug: 'sement', name: 'Sement', description: 'Qurilish uchun sement' },
  { slug: 'laminat', name: 'Laminat', description: 'Pol uchun laminat' },
];

try {
  const categories = await db.category.findMany({
    where: { slug: { in: ['qurilish', 'ustalar', 'kafe, restoran va choyxonalar'] } },
    include: { subCategories: true },
  });
  const construction = categories.find(c => c.slug === 'qurilish');
  const masters = categories.find(c => c.slug === 'ustalar');
  const cafe = categories.find(c => c.slug === 'kafe, restoran va choyxonalar');
  if (!construction || !masters || !cafe) throw new Error('Expected categories are missing; no changes applied.');
  const services = await db.subCategory.findMany({ where: { slug: { in: serviceSlugs } } });
  if (services.length !== 2 || services.some(s => ![construction.id, masters.id].includes(s.categoryId))) {
    throw new Error('Unexpected service categories; no changes applied.');
  }
  const existingProducts = await db.subCategory.findMany({ where: { slug: { in: products.map(p => p.slug) } } });
  if (existingProducts.some(p => p.categoryId !== construction.id)) throw new Error('Product slug conflict; no changes applied.');
  const listings = await db.listing.findMany({
    where: { subCategoryId: { in: services.map(s => s.id) } },
    select: { id: true, categoryId: true, subCategoryId: true },
  });
  console.log(JSON.stringify({
    apply: process.argv.includes('--apply'),
    rename: ['Qurilish mahsulotlari', 'Kafe, restoran va choyxonalar'],
    moveToMasters: services.map(s => s.slug),
    affectedListings: listings.length,
    products: products.map(p => p.name),
  }, null, 2));
  if (process.argv.includes('--apply')) {
    const backup = join(tmpdir(), `topbaza-catalog-before-${Date.now()}.json`);
    await writeFile(backup, JSON.stringify({ categories, listings, existingProducts }, null, 2), { mode: 0o600 });
    await db.$transaction(async tx => {
      await tx.category.update({ where: { id: construction.id }, data: {
        name: 'Qurilish mahsulotlari', nameUz: 'Qurilish mahsulotlari', nameRu: 'Строительные материалы',
        description: "G'isht, sement, laminat va boshqa qurilish mahsulotlari",
      } });
      await tx.category.update({ where: { id: cafe.id }, data: {
        name: 'Kafe, restoran va choyxonalar', nameUz: 'Kafe, restoran va choyxonalar',
      } });
      await tx.subCategory.updateMany({ where: { id: { in: services.map(s => s.id) } }, data: { categoryId: masters.id } });
      await tx.listing.updateMany({ where: { subCategoryId: { in: services.map(s => s.id) } }, data: { categoryId: masters.id } });
      for (const product of products) {
        await tx.subCategory.upsert({ where: { slug: product.slug }, update: {}, create: { ...product, categoryId: construction.id } });
      }
    }, { timeout: 30000 });
    console.log(`Catalog updated. Backup: ${backup}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Catalog correction failed');
  process.exitCode = 1;
} finally {
  await db.$disconnect();
}
