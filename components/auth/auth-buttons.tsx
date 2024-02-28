import { SignInButton, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Button } from "../ui/button";


export default function AuthButtons() {
  return (
    <Button asChild>
      <>
        <SignedIn>
          <SignOutButton />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
      </>
    </Button>
  )
}
