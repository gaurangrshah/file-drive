"use client"

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import {
  useOrganization,
  useUser,
} from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { BgGradientBlur } from './_components/interface/bg-gradient-blur';

export default function Home() {

  return (
    <main className="container m-auto p-12 flex-1">
      <BgGradientBlur />
      <div className="mx-auto max-w-2xl py-8 mt-24 z-10">
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
            {/* <a
              href="/dashboard"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Learn more <span aria-hidden="true">→</span>
            </a> */}
          </div>
        </div>
      </div>
    </main>
  );
}
