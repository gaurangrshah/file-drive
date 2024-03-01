import { UploadButton } from '@/app/_components/interface/upload-button'
import Image from 'next/image'

export function EmptyFiles({ extend }: { extend?: boolean }) {
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
        You have no {extend ? "favorites" : "files"} yet.
      </h1>
      <UploadButton />
      <p className="mt-6 text-lg leading-8 text-gray-600">
        {extend ? "Add files to your favorites from the 'All Files' tab in the sidebar." : "Add files to your organization by clicking the 'Upload File' button."}
      </p>
    </div>
  )
}
