import PageLayout from "@/src/components/PageLayout";
import { AuditLogTable } from "@/src/components/audit/AuditLogTable";
import { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Audit Logs",
};

export default async function AuditLogsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/audit-logs`, {
    headers: await headers(),
    cache: "no-store",
  });

  const { data: logs } = await res.json();

  return (
    <PageLayout title="Audit Logs">
      <AuditLogTable data={logs ?? []} />
    </PageLayout>
  );
}