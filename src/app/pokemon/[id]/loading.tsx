import { PageContainer } from "@/components/ui/PageContainer";

export default function Loading() {
  return (
    <PageContainer width="narrow">
      <div className="skeleton h-4 w-32" />
      <div className="skeleton h-72 rounded-3xl" />
      <div className="skeleton h-6 w-2/3" />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="skeleton h-80 rounded-2xl" />
        <div className="skeleton h-80 rounded-2xl" />
      </div>
    </PageContainer>
  );
}
