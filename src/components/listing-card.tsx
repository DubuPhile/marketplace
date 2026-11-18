import Link from "next/link";
import { MapPin, Image as ImageIcon } from "lucide-react";
import type { Listing } from "@/types/listing";
import { formatPrice, timeAgo } from "@/lib/utils";
import Image from "next/image";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      href={`/listing/${listing.id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        {listing.image_url ? (
          <Image
            src={listing.image_url}
            alt={listing.title}
            width={100}
            height={100}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-300">
            <ImageIcon size={42} />
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-700">
          {listing.category}
        </span>
      </div>
      <div className="p-4">
        <p className="text-lg font-extrabold text-slate-900">
          {formatPrice(Number(listing.price))}
        </p>
        <h3 className="mt-1 line-clamp-1 font-semibold text-slate-800">
          {listing.title}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
          <span className="flex min-w-0 items-center gap-1">
            <MapPin size={13} />
            <span className="truncate">
              {listing.location || "Philippines"}
            </span>
          </span>
          <span className="shrink-0">{timeAgo(listing.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}
