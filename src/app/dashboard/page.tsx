import { mockProducts } from '@/lib/mock-data';
import { DashboardClient } from '@/components/dashboard-client';

export default function DashboardPage() {
  // In a real application, you would fetch this data from your API
  const products = mockProducts;

  return <DashboardClient initialProducts={products} />;
}
