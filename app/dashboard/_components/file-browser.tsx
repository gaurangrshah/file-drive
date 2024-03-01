"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from '@/convex/_generated/api';
import { Loader2 } from "lucide-react";
import { EmptyFiles } from "./empty-files";
import { RawFavorites, RawFiles } from "@/convex/schema";
import { FileCard } from "./file-card";
import { SearchBar } from "@/app/_components/interface/search-bar";
import { useState } from "react";
import { redirect } from "next/navigation";

export function FileBrowser({ title, favoritesOnly, deletedOnly }: { title: string; favoritesOnly?: boolean; deletedOnly?: boolean }) {
  const [query, setQuery] = useState('')
  const organization = useOrganization()
  const user = useUser();
  const createFile = useMutation(api.mutations.files.createFile)
  // query is being scoped by the orgId which we've defined in file://../convex/files.ts
  // first ensure the orgId is loaded and then pass it to the query or skip if no orgId

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = String(organization.organization?.id ?? user.user?.id)
  }

  const _favorites = useQuery(api.queries.favorites.getAllFavorites, { orgId: orgId! })
  const files = useQuery(api.queries.files.getFiles, { orgId: orgId!, query, favorites: favoritesOnly, deletedOnly })

  // @TODO: this is a bit of a mess, we should probably just use a join query
  // to get the favorited status of each file
  const joinedFiles = files?.map((file) => {
    const isFavorited = _favorites?.some(
      (favorite: RawFavorites) => favorite.fileId === file._id
    )
    return { ...file, isFavorited }
  })

  const isLoading = files === undefined;


  return (
    <main className="container mx-auto pb-12 px-12">
      <div className="flex flex-row justify-between relative isolate py-8">
        <h1 className='text-4xl font-bold'>{title}</h1>
        <SearchBar
          query={query}
          setQuery={setQuery}
        />
      </div>
      <div className=''>
        {isLoading ? (
          <div className='flex flex-col justify-center items-center w-full relative'>
            <Loader2
              className="animate-spin flex-1"
            />
          </div>
        ) : files.length ? (
          <div className="grid grid-cols-4 gap-4">
            {joinedFiles?.map((file: RawFiles) => (
              <FileCard key={file?._id ?? "test"} file={{ ...file, isFavorited: (file as any).isFavorited }} />
            ))}
          </div>
        ) : <EmptyFiles extend={favoritesOnly} />}
      </div>
    </main>
  )
}
