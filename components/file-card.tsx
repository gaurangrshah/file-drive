import { formatRelative } from 'date-fns';
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
} from 'lucide-react';
import Image from 'next/image';

import {
  Avatar,
  AvatarFallback,
} from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import {
  dataUrl,
  PlaceholderValue,
} from '@/lib/utils';

import {
  FileCardActions,
  getFileUrl,
} from './file-actions';
import { AspectRatio } from './ui/aspect-ratio';
import { BlurImage } from './blur-image';

export function FileCard({
  file,
}: {
  file: Doc<"files"> & { isFavorited: boolean };
}) {
  // const userProfile = useQuery(api.users.getUserProfile, {
  //   userId: file.userId,
  // });

  const typeIcons = {
    image: <ImageIcon />,
    pdf: <FileTextIcon />,
    csv: <GanttChartIcon />,
  } as Record<Doc<"files">["type"], React.ReactNode>;

  return (
    <Card>
      <CardHeader className="relative flex flex-row items-center justify-between p-3 pb-6">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="text-center">{typeIcons[file.type]}</div>{" "}
          {file.name}
        </CardTitle>
        <FileCardActions isFavorited={file.isFavorited} file={file} />

      </CardHeader>
      <CardContent className="w-full max-h-[250px] flex justify-center items-center">
        {file.type === "image" && (
          <AspectRatio ratio={16 / 9} className='w-full h-full'>
            <Image
              alt={file.name}
              src={getFileUrl(file.fileId)}
              fill
              objectFit="cover"
              loading="lazy"
              // @SEE: shimmer effect: lib/utils.ts
              placeholder={dataUrl as PlaceholderValue}
            />
          </AspectRatio>

        )}

        {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
        {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
          <Avatar className="w-6 h-6">
            {/* <AvatarImage src={userProfile?.image} /> */}
            <AvatarFallback>GS</AvatarFallback>
          </Avatar>
          {/* {userProfile?.name} */}
        </div>
        <div className="text-xs text-gray-700">
          Uploaded on {formatRelative(new Date(file._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
}
