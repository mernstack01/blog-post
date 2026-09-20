import { getSystemSettingsAction } from '@/actions/settings-actions';
import FooterClient from '@/components/FooterClient';

export default async function Footer() {
  const settings = await getSystemSettingsAction();

  const siteTitle = settings.siteTitle || 'XayrliIsh.uz';
  const phone = settings.contactPhone || '+998 90 123 45 67';
  const telegram = (settings.telegramUsername || 'xayrliish_admin').replace(/^@/, '');
  const email = settings.supportEmail || 'info@xayrliish.uz';

  return (
    <FooterClient
      siteTitle={siteTitle}
      phone={phone}
      telegram={telegram}
      email={email}
    />
  );
}
