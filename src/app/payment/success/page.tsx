"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import {
  Check,
  ArrowRight,
  ShoppingBag,
  Home,
  ShieldCheck,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 p-8 sm:p-10 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 relative flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full bg-green-100 animate-ping opacity-30" />
            <div className="relative w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
              <Check size={40} className="text-green-600" strokeWidth={3} />
            </div>
          </div>

          <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-3">
            Payment Successful
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Thank you for your purchase!
          </h1>

          <p className="text-slate-500 leading-relaxed mb-8">
            Your payment has been successfully processed. We appreciate your
            purchase and hope you enjoy your item!
          </p>

          {/* Transaction Details */}
          <div className="bg-slate-50 rounded-2xl p-5 text-left mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <ShoppingBag className="text-slate-700" size={20} />
              </div>
              <div>
                <p className="font-semibold text-slate-900">
                  Order Confirmation
                </p>
                <p className="text-xs text-slate-500">
                  Your transaction details
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-slate-500">Payment Status</span>
                <span className="font-semibold text-green-600">Paid</span>
              </div>

              {sessionId && (
                <div className="flex flex-col gap-1 mt-3 text-sm">
                  <span className="text-slate-500">Transaction ID</span>
                  <span className="font-mono text-xs text-slate-700 break-all">
                    {sessionId}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl transition-all"
            >
              <Home size={18} />
              Back to Marketplace
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/"
              className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold py-4 rounded-xl transition-all"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-2 mt-8 text-xs text-slate-400">
            <ShieldCheck size={15} />
            Secure payment powered by Stripe
          </div>
        </div>

        <p className="text-center text-sm text-slate-400 mt-6">
          Need help? Contact our support team.
        </p>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
