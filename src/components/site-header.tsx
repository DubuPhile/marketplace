import Link from "next/link";
import { Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-black tracking-tight text-slate-900"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Store size={19} />
          </span>
          <div>
            <span>Market</span>
            <span className="text-blue-600 pl-0">place</span>
          </div>
        </Link>
        <Link href="/create-listing">
          <Button>
            <Plus size={17} />{" "}
            <span className="hidden sm:inline">Sell an item</span>
            <span className="sm:hidden">Sell</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
