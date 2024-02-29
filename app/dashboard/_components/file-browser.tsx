"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from '@/convex/_generated/api';
import { Loader2 } from "lucide-react";
import { EmptyFiles } from "./empty-files";
import { RawFiles } from "@/convex/schema";
import { FileCard } from "./file-card";
import { SearchBar } from "@/app/_components/interface/search-bar";

export function FileBrowser({ title }: { title: string }) {
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
    <main className="container mx-auto pb-12 px-12">
      <div className="flex flex-row justify-between relative isolate py-8">
        <h1 className='text-4xl font-bold'>{title}</h1>
        <SearchBar
          query=""
          setQuery={() => { }}
        />
      </div>
      <div className=''>
        {isLoading ? (
          <div className='flex flex-col justify-center items-center w-full relative'>
            <Loader2
              className="animate-spin flex-1"
            />
          </div>
        ) : files.length === 0 ? <EmptyFiles /> : null}
        <div className="grid grid-cols-4 gap-4">
          {files?.map((file: RawFiles) => (
            <FileCard key={file?._id ?? "test"} file={{ ...file, isFavorited: false }} />
          ))}
        </div>
      </div>
    </main>
  )
}
