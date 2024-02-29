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

export default function Home() {
  const organization = useOrganization()
  const user = useUser();
  const createFile = useMutation(api.mutations.files.createFile)
  // query is being scoped by the orgId which we've defined in file://../convex/files.ts
  // first ensure the orgId is loaded and then pass it to the query or skip if no orgId
  const orgId = organization.organization?.id ?? user.user?.id!; // user id must exist
  const currentOrgId = String(organization.isLoaded && user.isLoaded ? orgId : "skip");
  const files = useQuery(api.queries.files.getFiles, { orgId: currentOrgId })
  return (
    <main className="container mx-auto p-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className='text-4xl font-bold'>Your Files</h1>
        <UploadButton />
      </div>
      <div className="grid grid-cols-4 gap-4">
        {files?.map((file: RawFiles) => (
          <FileCard key={file?._id ?? "test"} file={file} />
        ))}

      </div>
    </main>
  );
}
