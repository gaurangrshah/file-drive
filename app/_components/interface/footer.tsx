import Link from "next/link";

export function Footer() {
  return (
    <div className="container fixed bottom-0 py-4 px-12 bg-gray-100 mt-12 flex items-center">
      <div className="container mx-auto flex justify-between items-center">
        <div>FileDrive<span className="text-xs"> - for demo purposes only</span></div>

        <div className="flex gap-8">
          <Link className="text-blue-900 hover:text-blue-500" href="/privacy">
            Privacy Policy
          </Link>
          <Link
            className="text-blue-900 hover:text-blue-500"
            href="/terms-of-service"
          >
            Terms of Service
          </Link>
          <Link className="text-blue-900 hover:text-blue-500" href="/about">
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
