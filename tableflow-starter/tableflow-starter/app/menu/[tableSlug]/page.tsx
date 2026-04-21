import MenuClient from '@/components/MenuClient';
import { menuItems } from '@/lib/demo-data';

export default async function MenuPage({ params }: { params: Promise<{ tableSlug: string }> }) {
  const { tableSlug } = await params;

  return (
    <main className="page">
      <MenuClient tableSlug={tableSlug} menuItems={menuItems} />
    </main>
  );
}
