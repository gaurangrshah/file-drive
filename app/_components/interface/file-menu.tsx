import { Button } from '@/components/ui/button'
import { UploadButton } from '@/components/upload-button'
import Link from 'next/link'


export default function FileMenu() {
  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <Button type="button" className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-blue-500 dark:focus:text-white">

        <Link href="/dashboard/files">Your Files</Link>

      </Button>
      <UploadButton />

    </div>
  )
}
