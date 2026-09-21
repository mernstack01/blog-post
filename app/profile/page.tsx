import type { Metadata } from 'next';
import { getUserFullProfileAction } from '@/actions/user-auth-actions';
import ProfileClient from '@/components/ProfileClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Foydalanuvchi Profili - TopBaza.uz",
  description: "TopBaza.uz kadrlar va xizmatlar portali foydalanuvchisi shaxsiy kabineti, e'lonlar statistikasi va profil sozlamalari.",
};

export default async function ProfilePage() {
  const result = await getUserFullProfileAction();

  const initialData = {
    user: result.user || null,
    stats: result.stats || null,
    listings: result.listings || [],
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <ProfileClient
        initialData={initialData}
        isAuthenticated={Boolean(result.success && result.user)}
      />
    </div>
  );
}
