"use-client"
import Image from 'next/image';

import {
  dataUrl,
  PlaceholderValue,
} from '@/lib/utils';

import { AspectRatio } from '../../../components/ui/aspect-ratio';



type BlurImageProps = {
  src: string;
  alt: string;
};

export function BlurImage({ src, alt }: BlurImageProps) {
  return (
    <div className="relative">
      <AspectRatio ratio={16 / 9} className='w-full h-full'>
        <Image
          src={src}
          alt={alt}
          fill
          objectFit="contain"
          // @SEE: shimmer effect: lib/utils.ts
          placeholder={dataUrl as PlaceholderValue}
        />
      </AspectRatio>
    </div>
  );
}
