"use client"

import {
  useMutation,
  useQuery,
} from 'convex/react';

import { FileCard } from '@/components/file-card';
import { UploadButton } from '@/components/upload-button';
import { api } from '@/convex/_generated/api';
import { RawFiles } from '@/convex/schema';
import {
  useOrganization,
  useUser,
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { EmptyFiles } from './_components/interface/empty-files';
import { BgGradientBlur } from './_components/interface/bg-gradient-blur';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const organization = useOrganization()
  const user = useUser();
  const createFile = useMutation(api.mutations.files.createFile)
  // query is being scoped by the orgId which we've defined in file://../convex/files.ts
  // first ensure the orgId is loaded and then pass it to the query or skip if no orgId
  const orgId = organization.organization?.id ?? user.user?.id!; // user id must exist
  const currentOrgId = String(organization.isLoaded && user.isLoaded ? orgId : "skip");
  const files = useQuery(api.queries.files.getFiles, { orgId: currentOrgId })

  const isLoading = files === undefined;
  return (
    <main className="container mx-auto p-12">
      <BgGradientBlur />
      {isLoading ? (
        <div className='flex flex-col justify-center items-center w-full relative'>
          <Loader2
            className="animate-spin flex-1"
          />
        </div>
      ) : files.length === 0 ? <EmptyFiles /> : null}
      <div className="relative isolate px-6 pt-14 lg:px-6">
        <h1 className='text-4xl font-bold'>Your Files</h1>
        <UploadButton />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {files?.map((file: RawFiles) => (
          <FileCard key={file?._id ?? "test"} file={{ ...file, isFavorited: false }} />
        ))}
      </div>
      <div className="mx-auto max-w-2xl py-8">
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
              href="/dashboard/files"
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
