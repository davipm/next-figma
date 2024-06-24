"use client";

import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Props {
  name: string;
  otherStyle?: string;
}

export function Avatar({ name, otherStyle }: Props) {
  return (
    <Tooltip>
      <TooltipTrigger>
        <div
          className={`relative h-9 w-9 rounded-full ${otherStyle}`}
          data-tooltip={name}
        >
          <Image
            src={`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}
            fill
            className="rounded-full"
            alt={name}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent className="border-none bg-primary-grey-200 px-2.5 py-1.5 text-xs text-white">
        {name}
      </TooltipContent>
    </Tooltip>
  );
}
