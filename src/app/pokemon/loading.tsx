import { PageContainer } from "@/components/ui/PageContainer";
import { PAGE_SIZE } from "@/features/pokemon";

export default function Loading() {
  return (
    <PageContainer>
      <div className="skeleton h-9 w-40" />
      <ul className="card-grid">
        {Array.from({ length: PAGE_SIZE }, (_, index) => (
          <li key={index} className="skeleton h-48 rounded-2xl" />
        ))}
      </ul>
    </PageContainer>
  );
}
