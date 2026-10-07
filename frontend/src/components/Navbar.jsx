"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Home, UserCheck, History, Star, LogIn, LogOut, Menu, X, User, LayoutDashboard } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    router.refresh();
  };

  const baseNavItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Present Member", href: "/present-member", icon: UserCheck },
    { label: "Past Member", href: "/past-member", icon: History },
    { label: "Review", href: "/review", icon: Star },
  ];

  const dashboardItem = session?.user
    ? {
        label: "Dashboard",
        href: session.user.role === "manager" ? "/manager" : "/border",
        icon: LayoutDashboard,
      }
    : null;

  const navItems = dashboardItem ? [...baseNavItems, dashboardItem] : baseNavItems;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur print:hidden">
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
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {session?.user ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>{session.user.name || session.user.email}</span>
              </span>
              <Button
                onClick={handleSignOut}
                className="bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Link href="/signin">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 text-sm">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            </Link>
          )}
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
          {session?.user ? (
            <div className="pt-2 space-y-2">
              <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
                <User className="w-4 h-4 text-amber-500" />
                <span>{session.user.name || session.user.email}</span>
              </div>
              <Button
                onClick={() => {
                  setIsOpen(false);
                  handleSignOut();
                }}
                className="w-full bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          ) : (
            <Link href="/signin" onClick={() => setIsOpen(false)} className="block pt-2">
              <Button className="w-full bg-amber-500 text-white py-2 rounded-lg flex items-center justify-center gap-2 text-sm font-medium">
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
