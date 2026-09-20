import { getCategoriesAction } from '@/actions/listing-actions';
import NewListingForm from '@/components/NewListingForm';
import NewListingHeader from '@/components/NewListingHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Yangi e'lon berish - Sirdaryo Xizmatlari",
  description: "Sirdaryo viloyati va Guliston shahrida o'z xizmatlaringiz, mutaxassisligingiz yoki ustaxonangiz haqida bepul e'lon bering.",
};

export default async function NewListingPage() {
  const categories = await getCategoriesAction();

  return (
    <div className="min-h-screen bg-[#fffdfa] dark:bg-[#0f172a] py-8 sm:py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewListingHeader />
        <NewListingForm categories={categories} />
      </div>
    </div>
  );
}

