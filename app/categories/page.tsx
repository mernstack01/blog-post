import { getCategoriesAction } from '@/actions/listing-actions';
import CategoriesClient from '@/components/CategoriesClient';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Xizmatlar katalogi - Sirdaryo Xizmatlari",
  description: "Sirdaryo viloyati bo'yicha barcha xizmatlar, sohalar va ustalar toifalari ro'yxati.",
};

export default async function CategoriesPage() {
  const categories = await getCategoriesAction();

  return <CategoriesClient categories={categories as any} />;
}
