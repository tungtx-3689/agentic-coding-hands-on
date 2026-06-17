import { OverviewTable } from "@/components/admin/overview-table";
import { getDepartmentStats } from "@/lib/db/queries/admin";

export default async function AdminOverviewPage() {
  const data = await getDepartmentStats();

  return <OverviewTable data={data} />;
}
