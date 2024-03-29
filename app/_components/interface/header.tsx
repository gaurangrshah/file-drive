
import { Button } from "@/components/ui/button";
import {
  OrganizationSwitcher,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import FileMenu from "./file-menu";
import { SearchBar } from "./search-bar";

export function Header() {
  return (
    <div className="relative z-10 border-b py-4 bg-gray-50 backdrop-blur-2xl bg-opacity-30">
      <div className="items-center container mx-auto justify-between flex">
        <Link href="/" className="flex gap-2 items-center text-xl text-black">
          <Image src="/logo.png" width="50" height="50" alt="file drive logo" />
          FileDrive
        </Link>

        <SignedIn>
          <FileMenu />
        </SignedIn>

        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
          <SignedOut>
            <SignInButton redirectUrl="/dashboard/files">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
