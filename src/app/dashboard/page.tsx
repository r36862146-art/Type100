import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Your Dashboard",
  description: "View your typing progress, analytics, streaks, and personal records.",
  canonical: "/dashboard",
  noIndex: true, // Dashboards are private
});

export default function DashboardPage() {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <DashboardLayout />
    </div>
  );
}
