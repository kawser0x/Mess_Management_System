import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  CigaretteOff,
  Ban,
  Heart,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-700 dark:text-zinc-300 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-lg text-amber-500">
              <Image src="/logo.png" alt="11 Star House Logo" width={36} height={36} className="rounded-lg object-cover" />
              <span>11 Star House</span>
            </Link>
            <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-normal">
              ১৯৯৭ সাল থেকে সেবায় নিয়োজিত। একটি সম্পূর্ণ ধূমপান মুক্ত ও রাজনীতি মুক্ত পরিবেশ, যেখানে প্রতিটি সদস্য লাভ করেন পরম শান্তি ও স্বাস্থ্যকর আবাসন।
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold">
                <CigaretteOff className="w-3 h-3" /> ধূমপান মুক্ত
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                <Ban className="w-3 h-3" /> রাজনীতি মুক্ত
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              দ্রুত লিঙ্কসমূহ
            </h3>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition inline-flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-zinc-400" /> হোম পেজ
                </Link>
              </li>
              <li>
                <Link href="/present-member" className="hover:text-amber-600 dark:hover:text-amber-400 transition inline-flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-zinc-400" /> বর্তমান সদস্যবৃন্দ
                </Link>
              </li>
              <li>
                <Link href="/past-member" className="hover:text-amber-600 dark:hover:text-amber-400 transition inline-flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-zinc-400" /> প্রাক্তন সদস্যবৃন্দ
                </Link>
              </li>
              <li>
                <Link href="/review" className="hover:text-amber-600 dark:hover:text-amber-400 transition inline-flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-zinc-400" /> সদস্য রিভিউ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Account & Portals */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              মেম্বার পোর্টাল
            </h3>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/signin" className="hover:text-amber-600 dark:hover:text-amber-400 transition inline-flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-zinc-400" /> মেম্বার লগইন (Sign In)
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-amber-600 dark:hover:text-amber-400 transition inline-flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-zinc-400" /> নতুন মেম্বার রেজিস্ট্রেশন
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-amber-600 dark:hover:text-amber-400 transition inline-flex items-center gap-1">
                  <ArrowRight className="w-3 h-3 text-zinc-400" /> ম্যানেজার লগইন (11star@gmail.com)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
              যোগাযোগ
            </h3>
            <ul className="space-y-2.5 font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>১১ স্টার হাউস, মেস লেন, ছাত্রাবাস এলাকা</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>+880 1852-249441</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>11star@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
          <p>© ১৯৯৭ - ২০২৬ 11 Star House. সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            মেসের ঐতিহ্য ও সেবায় প্রস্তুত <Heart className="w-3 h-3 text-red-500 fill-red-500" /> 11 Star Team
          </p>
        </div>
      </div>
    </footer>
  );
}
