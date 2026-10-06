import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Border Dashboard | 11 Star House",
};

export default function BorderLayout({ children }) {
  return (
    <div className="flex flex-1 min-h-[calc(100vh-4rem)]">
      <Sidebar role="border" />
      <div className="flex-1 p-4 md:p-8 overflow-auto bg-zinc-50 dark:bg-zinc-950/50">
        {children}
      </div>
    </div>
  );
}
