import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripes";
import { supabase } from "@/lib/supabase/client";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.NEXT_STRIPE_WEBHOOK_SECRET!,
    );
  } catch (error) {
    console.error("Webhook signature error:", error);

    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const buyerEmail = session.customer_details?.email;

        if (!buyerEmail) {
          console.error("Buyer email not found:", session.id);

          return NextResponse.json(
            { error: "Buyer email not found" },
            { status: 400 },
          );
        }

        if (session.payment_status !== "paid") break;

        const { error } = await supabase
          .from("orders")
          .update({
            status: "paid",
            buyer_email: buyerEmail,
            stripe_payment_intent_id:
              typeof session.payment_intent === "string"
                ? session.payment_intent
                : (session.payment_intent?.id ?? null),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_session_id", session.id)
          .eq("status", "pending");

        if (error) {
          console.error("Supabase order update error:", error);

          return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 },
          );
        }

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;

        const { error } = await supabase
          .from("orders")
          .update({
            status: "cancelled",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_session_id", session.id)
          .eq("status", "pending");

        if (error) {
          console.error("Supabase order cancellation error:", error);

          return NextResponse.json(
            { error: "Failed to update order" },
            { status: 500 },
          );
        }

        break;
      }

      default:
        console.log(`Unhandled Stripe event: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
