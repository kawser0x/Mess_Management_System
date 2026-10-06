"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Utensils,
  PieChart,
  MessageSquare,
  Settings,
  CreditCard,
  User,
} from "lucide-react";

export default function Sidebar({ role }) {
  const pathname = usePathname();

  const managerLinks = [
    { label: "Overview", href: "/manager", icon: LayoutDashboard },
    { label: "Members", href: "/manager/members", icon: Users },
    { label: "Meal Chart", href: "/manager/meals", icon: Utensils },
    { label: "Finances", href: "/manager/finances", icon: PieChart },
    { label: "Notices", href: "/manager/notices", icon: MessageSquare },
    { label: "Settings", href: "/manager/settings", icon: Settings },
  ];

  const borderLinks = [
    { label: "Overview", href: "/border", icon: LayoutDashboard },
    { label: "My Meals", href: "/border/meals", icon: Utensils },
    { label: "Payments", href: "/border/payments", icon: CreditCard },
    { label: "Notices", href: "/border/notices", icon: MessageSquare },
    { label: "Profile", href: "/border/profile", icon: User },
  ];

  const links = role === "manager" ? managerLinks : borderLinks;

  return (
    <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex-shrink-0 flex flex-col h-[calc(100vh-4rem)] sticky top-16 hidden md:flex">
      <div className="p-4 flex-1 overflow-y-auto space-y-1">
        {links.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition font-medium ${
                isActive
                  ? "bg-amber-500/10 text-amber-500"
                  : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
