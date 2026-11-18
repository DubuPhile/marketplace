import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripes";
import { supabase } from "@/lib/supabase/client";

export async function POST(request: Request) {
  try {
    const { listingId } = await request.json();

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 },
      );
    }

    // Fetch the actual listing and price from Supabase
    const { data: listing, error } = await supabase
      .from("listings")
      .select("id, title, price,image_url")
      .eq("id", listingId)
      .single();

    console.log(listing);

    if (error || !listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "php",
            product_data: {
              name: listing.title,
              images: listing.image_url,
            },
            unit_amount: Math.round(Number(listing.price) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        listingId: listing.id,
      },
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/listing/${listing.id}`,
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: "Unable to create checkout session" },
      { status: 500 },
    );
  }
}
