"use client"

import {
  useMutation,
  useQuery,
} from 'convex/react';

import { FileCard } from '@/app/dashboard/_components/file-card';
import { UploadButton } from '@/components/upload-button';
import { api } from '@/convex/_generated/api';
import { RawFiles } from '@/convex/schema';
import {
  useOrganization,
  useUser,
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { EmptyFiles } from './dashboard/_components/empty-files';
import { BgGradientBlur } from './_components/interface/bg-gradient-blur';
import { Loader2 } from 'lucide-react';
import { SearchBar } from './_components/interface/search-bar';

export default function Home() {
  const organization = useOrganization()
  const user = useUser();
  // query is being scoped by the orgId which we've defined in file://../convex/files.ts
  // first ensure the orgId is loaded and then pass it to the query or skip if no orgId
  const orgId = organization.organization?.id ?? user.user?.id!; // user id must exist
  const currentOrgId = String(organization.isLoaded && user.isLoaded ? orgId : "skip");
  const files = useQuery(api.queries.files.getFiles, { orgId: currentOrgId })

  const isLoading = files === undefined;
  return (
    <main className="container m-auto p-12 flex-1">
      <BgGradientBlur />
      <div className="mx-auto max-w-2xl py-8 mt-24">
        <div className="text-center">
          <Image
            src="/logo.png"
            width="200"
            height="200"
            alt="file drive logo"
            className="inline-block mb-8"
          />

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            The easiest way to upload and share files with your company
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Make and account and start managing your files in less than a
            minute.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="#filelist"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Get started
            </Link>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
