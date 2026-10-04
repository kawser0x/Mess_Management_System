import Link from "next/link";
import Image from "next/image";
import { Button } from "@heroui/react";
import {
  Users,
  Star,
  HeartPulse,
  History as HistoryIcon,
  ArrowRight,
  Sparkles,
  CigaretteOff,
  Ban,
  CheckCircle2,
} from "lucide-react";

export default function Hero() {
  const stats = [
    {
      icon: HistoryIcon,
      title: "১৯৯৭ সালে প্রতিষ্ঠিত",
      subtitle: "২৭+ বছরের দীর্ঘ পথচলা ও অভিজ্ঞতা",
    },
    {
      icon: HeartPulse,
      title: "স্বাস্থ্যকর জীবনযাত্রা",
      subtitle: "স্বাস্থ্যসম্মত খাবার ও পরিচ্ছন্ন পরিবেশ",
    },
    {
      icon: CigaretteOff,
      title: "ধূমপান ও রাজনীতি মুক্ত",
      subtitle: "১০০% ধূমপান ও রাজনীতি মুক্ত পরিবেশ",
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden text-zinc-900 dark:text-zinc-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-zinc-200/50 dark:bg-grid-zinc-800/30" />

      <section className="relative max-w-7xl mx-auto px-4 py-8 ">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Badges Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>প্রতিষ্ঠিত ১৯৯৭ • 11 Star House</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold">
                <CigaretteOff className="w-3.5 h-3.5 text-red-500" />
                <span>ধূমপান মুক্ত</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold">
                <Ban className="w-3.5 h-3.5 text-blue-500" />
                <span>রাজনীতি মুক্ত</span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              ১১ স্টার মেসে আপনাকে স্বাগতম <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent pt-2">
                শান্তি ও সুস্বাস্থ্যকর জীবনযাত্রার
              </span>{" "}
              নির্ভরযোগ্য আবাসন
            </h1>

            {/* History & Story Paragraph (Bangla) */}
            <p className="text-base sm:text-lg text-zinc-700 dark:text-zinc-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              ১৯৯৭ সালে প্রতিষ্ঠিত{" "}
              <strong className="text-zinc-900 dark:text-zinc-50 font-bold">
                ১১ স্টার মেস
              </strong>{" "}
              দীর্ঘ ২৭ বছর ধরে সদস্যদের জন্য নিশ্চিত করে আসছে একটি শান্তিপূর্ণ ও
              সুস্বাস্থ্যকর আবাসন ব্যবস্থা। প্রতিষ্ঠার পর থেকেই প্রতিটি সদস্য
              এখানে পরম শান্তি, নিরাপত্তা এবং উন্নত জীবনযাত্রার সুফল উপভোগ করে
              আসছেন। আমাদের মেস সম্পূর্ণ{" "}
              <strong className="text-amber-600 dark:text-amber-400 font-bold">
                ধূমপান মুক্ত (No Smoking)
              </strong>{" "}
              এবং{" "}
              <strong className="text-amber-600 dark:text-amber-400 font-bold">
                রাজনীতি মুক্ত (Politics Free)
              </strong>
              , যা প্রতিটি সদস্যকে অধ্যয়ন ও শান্তিতে বসবাসের চমৎকার পরিবেশ
              প্রদান করে।
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/present-member">
                <Button className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 text-sm transition">
                  <Users className="w-4.5 h-4.5" />
                  <span>বর্তমান সদস্যদের তালিকা</span>
                </Button>
              </Link>
              <Link href="/review">
                <Button className="w-full sm:w-auto bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                  <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500/20" />
                  <span>রিভিউ দেখুন</span>
                  <ArrowRight className="w-4 h-4 text-zinc-400" />
                </Button>
              </Link>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              {stats.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-1">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 w-fit">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                      {item.title}
                    </span>
                    <span className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                      {item.subtitle}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Visual Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-2xl space-y-6 text-center text-zinc-900 dark:text-zinc-50">
              {/* Blur Glow Effect */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

              {/* Logo & Title */}
              <div className="relative flex flex-col items-center space-y-3">
                <div className="relative w-28 h-28 overflow-hidden rounded-2xl border-2 border-amber-500/40 shadow-lg">
                  <Image
                    src="/logo.png"
                    alt="11 Star House Logo"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-300">
                    11 Star House
                  </h2>
                  <p className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    প্রতিষ্ঠিত ১৯৯৭ • পরিবেশ ও স্বাচ্ছন্দ্যের সেরা স্থান
                  </p>
                </div>
              </div>

              {/* Mess Highlights List */}
              <div className="space-y-3 text-xs text-left bg-zinc-100 dark:bg-zinc-950 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium">
                <div className="flex items-center gap-2.5 font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>১০০% ধূমপান মুক্ত পরিবেশ (No Smoking)</span>
                </div>
                <div className="flex items-center gap-2.5 font-bold text-blue-600 dark:text-blue-400">
                  <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span>সম্পূর্ণ রাজনীতি মুক্ত আবাসন (Politics Free)</span>
                </div>
                <div className="flex items-center gap-2.5 font-semibold text-zinc-900 dark:text-zinc-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>শান্তিপূর্ণ, স্বাস্থ্যকর ও নিরিবিলি পড়াশোনার আবহ</span>
                </div>
                <div className="flex items-center gap-2.5 font-semibold text-zinc-900 dark:text-zinc-100">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>স্বাদ ও পুষ্টিসম্মত খাবার এবং পরিচ্ছন্নতা</span>
                </div>
              </div>

              {/* Direct Sign In CTA */}
              <Link href="/signin" className="block">
                <Button className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-amber-500 dark:hover:bg-amber-600 dark:text-white font-bold py-2.5 rounded-xl text-sm transition">
                  মেম্বার লগইন করুন
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
