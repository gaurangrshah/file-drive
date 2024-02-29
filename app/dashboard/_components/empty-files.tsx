import { UploadButton } from '@/components/upload-button'
import Image from 'next/image'
import React from 'react'

export function EmptyFiles() {
  return (
    <div className="col-span-4 text-center">
      <Image
        src="/empty.svg"
        width="200"
        height="200"
        alt="empty files"
        className="inline-block mb-8"
      />
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl pb-8">
        You have no files yet.
      </h1>
      <UploadButton />
      <p className="mt-6 text-lg leading-8 text-gray-600">
        Start uploading files and share them with your company.
      </p>
    </div>
  )
}
