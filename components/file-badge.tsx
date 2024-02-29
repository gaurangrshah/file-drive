import React from 'react'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { Text } from 'lucide-react';

export default function FileBadge({ type, className, children }: { type: string; className: string; children?: React.ReactNode }) {
  return (
    <div className="relative">
      <Badge className={cn("absolute -bottom-2 -right-4", className)}>.{type}</Badge>
      {children ?? <Text className="w-32 h-32 border-2 border-gray-400 py-2 rounded-md" />}
    </div>
  )
}
