"use client";

import { useMemo } from "react";
import { useOthers, useSelf } from "@/liveblocks.config";
import { Avatar } from "@/components/users/avatar";
import { generateRandomName } from "@/lib/utils";

export function ActiveUsers() {
  const others = useOthers();
  const currentUser = useSelf();

  return useMemo(() => {
    const hasMoreUsers = others.length > 2;
    return (
      <div className="flex items-center justify-center gap-1">
        {currentUser && (
          <Avatar name="You" otherStyle="border-[3px] border-primary-green" />
        )}

        {others.slice(0, 2).map(({ connectionId }) => (
          <Avatar
            key={connectionId}
            name={generateRandomName()}
            otherStyle="-ml-3"
          />
        ))}

        {hasMoreUsers && (
          <div className="z-10 -ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-primary-black">
            +{others.length - 2}
          </div>
        )}
      </div>
    );
  }, [others.length]);
}
