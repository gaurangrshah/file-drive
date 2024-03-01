"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from '@/convex/_generated/api';
import { Filter, GridIcon, Loader2, RowsIcon } from "lucide-react";
import { EmptyFiles } from "./empty-files";
import { RawFavorites } from "@/convex/schema";
import { FileCard } from "./file-card";
import { SearchBar } from "@/app/_components/interface/search-bar";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "./file-table";
import { Doc } from "@/convex/_generated/dataModel";
import { columns } from "./columns";

export function FileBrowser({ title, favoritesOnly, deletedOnly }: { title: string; favoritesOnly?: boolean; deletedOnly?: boolean }) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  const organization = useOrganization()
  const user = useUser();
  // query is being scoped by the orgId which we've defined in file://../convex/files.ts
  // first ensure the orgId is loaded and then pass it to the query or skip if no orgId

  let orgId: string | undefined = undefined;

  if (organization.isLoaded && user.isLoaded) {
    orgId = String(organization.organization?.id ?? user.user?.id)
  }

  const typeQuery = type === "all" ? undefined : type

  const favorites = useQuery(api.queries.favorites.getAllFavorites, { orgId: orgId! })
  const files = useQuery(api.queries.files.getFiles, orgId ? { orgId: orgId, type: typeQuery, query, favoritesOnly, deletedOnly } : "skip");

  // @TODO: this is a bit of a mess, we should probably just use a join query
  // to get the favorited status of each file
  const joinedFiles = files?.map((file) => {
    const isFavorited = (favorites ?? [])?.some(
      (favorite: RawFavorites) => favorite.fileId === file._id
    )
    return { ...file, isFavorited }
  }) ?? [];

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
      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList className="mb-2">
            <TabsTrigger value="grid" className="flex gap-2 items-center">
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select" className="sr-only" >Type Filter</Label>
            <Filter className="absolute z-10 pl-1" />
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="type-select" className="ps-8 w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="grid">
          <div className="grid grid-cols-3 gap-4">
            {joinedFiles?.map((file) => {
              return <FileCard key={file._id} file={{ ...file, isFavorited: !!file.isFavorited }} />;
            })}
          </div>
        </TabsContent>
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col gap-8 w-full items-center mt-24 h-[90vh] z-10">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your files...</div>
          </div>
        ) : joinedFiles?.length ? (
          <TabsContent value="table">
            <DataTable columns={columns} data={joinedFiles} />
          </TabsContent>
        ) : <EmptyFiles extend={favoritesOnly} />}
      </Tabs>
    </main>
  )
}
