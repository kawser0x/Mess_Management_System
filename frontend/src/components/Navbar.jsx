"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@heroui/react";
import { Home, UserCheck, History, Star, LogIn, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Present Member", href: "/present-member", icon: UserCheck },
    { label: "Past Member", href: "/past-member", icon: History },
    { label: "Review", href: "/review", icon: Star },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-amber-500">
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-lg object-cover" priority />
          <span>11 Star House</span>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition ${
                  isActive
                    ? "bg-amber-500/10 text-amber-500 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Theme Toggle */}
        <div className="hidden md:flex items-center gap-2">
          <ThemeToggle />
          <Link href="/signin">
            <Button className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 text-sm">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Button>
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-zinc-600 dark:text-zinc-400">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-200 dark:border-zinc-800 p-4 space-y-2 bg-white dark:bg-zinc-950">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                pathname === href ? "bg-amber-500/10 text-amber-500 font-semibold" : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}
          <Link href="/signin" onClick={() => setIsOpen(false)} className="block pt-2">
            <Button className="w-full bg-amber-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
