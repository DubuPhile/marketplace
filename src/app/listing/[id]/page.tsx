import { Suspense } from "react";
import ListingDetail from "./ListingDetails";

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ListingContent params={params} />
    </Suspense>
  );
}

async function ListingContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ListingDetail Id={id} />;
}
