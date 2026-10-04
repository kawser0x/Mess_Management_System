import { Star } from "lucide-react";

export default function ReviewPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-4xl mx-auto text-center">
      <div className="flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-6">
        <Star className="w-10 h-10 text-amber-500 fill-amber-500/20" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
        Member Reviews
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
        Read reviews and feedback from 11 Star House members.
      </p>
    </div>
  );
}
