import { getCategoriesAction } from '@/actions/listing-actions';
import { getCurrentUserAction } from '@/actions/user-auth-actions';
import { isUserAdmin } from '@/lib/admin-auth';
import NewListingForm from '@/components/NewListingForm';
import NewListingHeader from '@/components/NewListingHeader';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Yangi e'lon berish - Sirdaryo Xizmatlari",
  description: "Sirdaryo viloyati va Guliston shahrida o'z xizmatlaringiz, mutaxassisligingiz yoki ustaxonangiz haqida bepul e'lon bering.",
};

export const dynamic = 'force-dynamic';


export default async function NewListingPage() {
  const [categories, userRes, isAdmin] = await Promise.all([
    getCategoriesAction(),
    getCurrentUserAction(),
    isUserAdmin(),
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground pt-6 pb-28 sm:py-12 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NewListingHeader />
        <NewListingForm
          categories={categories as any}
          initialUser={userRes.user}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}

