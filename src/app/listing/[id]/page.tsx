import { Suspense } from "react";
import ListingDetail from "./ListingDetails";
import { Spinner } from "@/components/ui/spinner";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Spinner className="size-10 animate-spin text-gray-950" />
        </div>
      }
    >
      <ListingContent params={params} />
    </Suspense>
  );
}

async function ListingContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ListingDetail Id={id} />;
}
