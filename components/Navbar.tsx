import Link from "next/link";
import { AlignJustify, Clipboard } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Navbar() {
  return (
    <header className="bg-blue-500 shadow-md">
      <nav className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center">
          <h2 className="text-3xl font-bold text-white flex items-center space-x-2">
            <Clipboard className="mr-2" />
          </h2>
        </Link>
        <div className="hidden lg:flex items-center space-x-4 text-white">
          <Button variant="secondary">
            <Link href="/login">Login</Link>
          </Button>
          <Link href="/signup">
            <Button variant="outline" className="rounded">
              Sign Up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" aria-label="Open menu">
              <AlignJustify />
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-slate-950">
            <SheetHeader>
              <SheetTitle>
                <Link href="/" className="flex items-center">
                  <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                    <Clipboard className="mr-2" />
                    <span>Task Manager</span>
                  </h2>
                </Link>
              </SheetTitle>
              <div className="flex flex-col space-y-4 text-white">
                <Link href="/login">
                  <Button variant="secondary" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
