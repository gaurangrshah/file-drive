"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { FileIcon, StarIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="w-40 flex flex-col gap-4 pt-8 border-r h-full">
      <Button
        variant={"link"}
        className={clsx("flex gap-2", {
          "text-blue-500": pathname.includes("/dashboard/files"),
        })}
        asChild
      >
        <Link href="/dashboard/files">
          <FileIcon /> All Files
        </Link>
      </Button>

      <Button
        variant={"link"}
        className={clsx("flex gap-2", {
          "text-blue-500": pathname.includes("/dashboard/favorites"),
        })}
        asChild
      >
        <Link href="/dashboard/favorites">
          <StarIcon /> Favorites
        </Link>
      </Button>

      <Button
        variant={"link"}
        className={clsx("flex gap-2", {
          "text-blue-500": pathname.includes("/dashboard/trash"),
        })}
        asChild
      >
        <Link href="/dashboard/trash">
          <TrashIcon /> Trash
        </Link>
      </Button>
    </div >
  );
}
