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
import { EmptyFiles } from '../_components/empty-files';
import { BgGradientBlur } from '../../_components/interface/bg-gradient-blur';
import { Loader2 } from 'lucide-react';
import { SearchBar } from '../../_components/interface/search-bar';
import { FileBrowser } from '../_components/file-browser';

export default function Home() {
  // const organization = useOrganization()
  // const user = useUser();
  // const createFile = useMutation(api.mutations.files.createFile)
  // // query is being scoped by the orgId which we've defined in file://../convex/files.ts
  // // first ensure the orgId is loaded and then pass it to the query or skip if no orgId
  // const orgId = organization.organization?.id ?? user.user?.id!; // user id must exist
  // const currentOrgId = String(organization.isLoaded && user.isLoaded ? orgId : "skip");
  // const files = useQuery(api.queries.files.getFiles, { orgId: currentOrgId })

  // const isLoading = files === undefined;
  return <FileBrowser title="Your Files" />
}
