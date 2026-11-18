"use client";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Listing } from "@/types/listing";
import { CATEGORIES } from "@/types/listing";
import { ListingCard } from "@/components/listing-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [category, setCategory] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");
      let query = supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });
      if (category !== "All") query = query.eq("category", category);
      if (search.trim())
        query = query.ilike(
          "title",
          `%${search.trim().replace(/[%_]/g, "\\$&")}%`,
        );
      const { data, error: queryError } = await query;
      if (!active) return;
      if (queryError) setError(queryError.message);
      else setListings((data ?? []) as Listing[]);
      setLoading(false);
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [category, search]);

  return (
    <main>
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-16">
          <div>
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700">
              Your community marketplace
            </span>
            <h1 className="mt-5 max-w-2xl text-4xl font-black tracking-tight text-slate-950 sm:text-5xl md:text-6xl">
              Good finds.
              <br />
              <span className="text-blue-600">Great deals.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              Buy and sell pre-loved items in your community. Discover something
              useful or give your things a new home.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#listings">
                <Button size="lg" className="cursor-pointer" variant="default">
                  Explore listings
                </Button>
              </a>
              <a href="/create-listing">
                <Button size="lg" variant="outline" className="cursor-pointer">
                  Start selling
                </Button>
              </a>
            </div>
          </div>
          <div className="rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-900/10">
            <ShoppingBag className="mb-8 h-10 w-10 text-blue-100" />
            <p className="text-sm font-semibold text-blue-100">
              A simpler way to trade
            </p>
            <p className="mt-2 text-3xl font-bold leading-tight">
              List it. Find it. Make a deal.
            </p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100">
              No account required. Just share your listing and connect directly
              with buyers and sellers.
            </p>
          </div>
        </div>
      </section>

      <section id="listings" className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-blue-600">
              THE MARKETPLACE
            </p>
            <h2 className="mt-1 text-3xl font-black tracking-tight">
              Explore listings
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Find something you love from sellers in your community.
            </p>
          </div>
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              value={search}
              id="search"
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="mt-7 flex items-center gap-2 overflow-x-auto pb-2">
          <SlidersHorizontal
            size={17}
            className="mr-1 shrink-0 text-slate-400"
          />
          {CATEGORIES.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={category === item ? "default" : "outline"}
              className="shrink-0 rounded-full cursor-pointer"
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-4/5 animate-pulse rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
              Could not load listings: {error}. Check your Supabase URL, key,
              table and RLS policies.
            </div>
          ) : listings.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-20 text-center">
              <ShoppingBag className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-4 font-bold">No listings found</h3>
              <p className="mt-1 text-sm text-slate-500">
                Try another category or be the first to post an item.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
