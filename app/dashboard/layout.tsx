"use client"

import { SideNav } from "./_components/side-nav";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto pt-4 min-h-screen">
      <div className="flex gap-8">
        <div>
          <SideNav />
        </div>

        <div className="w-full mt-4">
          {children}
        </div>
      </div>
    </main>
  );
}
