"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImagePlus, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { CATEGORIES } from "@/types/listing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function CreateListingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<string>("Electronics");
  const [location, setLocation] = useState("Angeles City, Philippines");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function chooseImage(file?: File) {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5 MB or smaller.");
      return;
    }
    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const numericPrice = Number(price);
    if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
      setError("Enter a valid price greater than zero.");
      return;
    }
    setLoading(true);
    let uploadedPath: string | null = null;

    try {
      let imageUrl: string | null = null;
      if (image) {
        const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        uploadedPath = `public/${crypto.randomUUID()}-${safeName}`;
        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(uploadedPath, image, {
            contentType: image.type,
            cacheControl: "3600",
            upsert: false,
          });
        if (uploadError) throw uploadError;
        imageUrl = supabase.storage
          .from("listing-images")
          .getPublicUrl(uploadedPath).data.publicUrl;
      }

      const { data, error: insertError } = await supabase
        .from("listings")
        .insert({
          title: title.trim(),
          description: description.trim() || null,
          price: numericPrice,
          category,
          seller_email: email.trim().toLowerCase(),
          image_url: imageUrl,
          location: location.trim() || "Philippines",
        })
        .select("id")
        .single();

      if (insertError) throw insertError;
      router.push(`/listing/${data.id}`);
      router.refresh();
    } catch (err) {
      if (uploadedPath)
        await supabase.storage.from("listing-images").remove([uploadedPath]);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while publishing.",
      );
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft size={16} /> Back to marketplace
      </Link>
      <Card>
        <CardHeader>
          <p className="text-sm font-semibold text-blue-600">SELL SOMETHING</p>
          <CardTitle className="text-3xl">Create a listing</CardTitle>
          <p className="text-sm text-slate-500">
            Add your item details and let buyers contact you.
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Listing title *</Label>
              <Input
                id="title"
                required
                maxLength={255}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Pre-loved Sony headphones"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                maxLength={5000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the condition, features and anything buyers should know..."
              />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price">Price (PHP) *</Label>
                <Input
                  id="price"
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="2500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your email address *</Label>
              <Input
                id="email"
                required
                type="email"
                maxLength={255}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="none"
              />
              <p className="text-xs text-slate-500">
                Buyers will use this address to contact you through the
                marketplace.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                maxLength={255}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Philippines"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Product photo</Label>
              <label
                htmlFor="image"
                className="flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:border-blue-400"
              >
                {preview ? (
                  <Image
                    src={preview}
                    alt="Selected listing preview"
                    className="max-h-64 rounded-lg object-contain"
                    width={800}
                    height={600}
                    unoptimized
                  />
                ) : (
                  <>
                    <ImagePlus className="mb-2 h-8 w-8 text-slate-400" />
                    <span className="text-sm font-semibold">
                      Choose a photo
                    </span>
                    <span className="mt-1 text-xs text-slate-500">
                      JPG, PNG or WebP · up to 5 MB
                    </span>
                  </>
                )}
              </label>
              <input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => chooseImage(e.target.files?.[0])}
              />
            </div>
            {error && (
              <p
                role="alert"
                className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={17} /> Publishing...
                </>
              ) : (
                "Publish listing"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
