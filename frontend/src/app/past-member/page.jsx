import { History } from "lucide-react";

export default function PastMemberPage() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-4xl mx-auto text-center">
      <div className="flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-6">
        <History className="w-10 h-10 text-amber-500" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
        Past Members
      </h1>
      <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
        Explore alumni and past members who have lived at 11 Star House.
      </p>
    </div>
  );
}
