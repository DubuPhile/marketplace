"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Image as ImageIcon,
  MapPin,
  Mail,
  Send,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import type { Listing } from "@/types/listing";
import { formatPrice, timeAgo } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

type id = { Id: string };

export default function ListingDetailPage(params: id) {
  const id = params.Id;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    let active = true;
    async function loadListing() {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (!active) return;
      if (error) setPageError(error.message);
      else if (!data)
        setPageError("This listing may have been removed or does not exist.");
      else setListing(data as Listing);
      setLoading(false);
    }
    loadListing();
    return () => {
      active = false;
    };
  }, [id]);

  async function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!listing) return;
    setSending(true);
    setFeedback("");
    const { error } = await supabase.from("messages").insert({
      listing_id: listing.id,
      buyer_email: buyerEmail.trim().toLowerCase(),
      seller_email: listing.seller_email,
      message: message.trim(),
    });
    if (error) setFeedback(error.message);
    else {
      setFeedback("Your message has been sent to the seller.");
      setBuyerEmail("");
      setMessage("");
    }
    setSending(false);
  }

  if (loading)
    return (
      <main className="mx-auto max-w-6xl px-4 py-16">
        <div className="h-96 animate-pulse rounded-2xl bg-slate-200" />
      </main>
    );
  if (!listing)
    return (
      <main className="mx-auto max-w-4xl px-4 py-16">
        <Link href="/" className="text-sm text-blue-600">
          ← Back to marketplace
        </Link>
        <p className="mt-6 rounded-xl bg-red-50 p-5 text-red-700">
          {pageError || "Listing not found."}
        </p>
      </main>
    );

  const handleCheckout = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId: id,
          buyerEmail: buyerEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      window.location.href = data.url;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} /> Back to marketplace
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="flex aspect-4/3 items-center justify-center bg-slate-100">
            {listing.image_url ? (
              <Image
                src={listing.image_url}
                alt={listing.title}
                className="h-full w-full object-contain"
                width={800}
                height={600}
                unoptimized
              />
            ) : (
              <ImageIcon size={64} className="text-slate-300" />
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
              {listing.category}
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight">
              {listing.title}
            </h1>
            <p className="mt-3 text-3xl font-extrabold text-blue-600">
              {formatPrice(Number(listing.price))}
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin size={15} />
                {listing.location || "Philippines"}
              </span>
              <span>{timeAgo(listing.created_at)}</span>
            </div>
          </div>
          <Card>
            <CardContent className="p-5">
              <h2 className="font-bold">Description</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                {listing.description ||
                  "The seller hasn't added a description."}
              </p>
            </CardContent>
          </Card>
          <Button type="submit" onClick={handleCheckout}>
            Buy
          </Button>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-500">Listed by</p>
                  <p className="font-semibold">{listing.seller_email}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <h2 className="text-xl font-bold">Message seller</h2>
              <p className="mt-1 text-sm text-slate-500">
                {"Ask a question or let the seller know you're interested."}
              </p>
              <form onSubmit={sendMessage} className="mt-5 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buyerEmail">Your email</Label>
                  <Input
                    id="buyerEmail"
                    type="email"
                    required
                    maxLength={255}
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    minLength={1}
                    maxLength={3000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Hi! Is this item still available?"
                  />
                </div>
                {feedback && (
                  <p
                    role="status"
                    className={`rounded-lg p-3 text-sm ${feedback.includes("sent") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                  >
                    {feedback}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
