"use client";

import { useState } from "react";
import { ThreadData } from "@liveblocks/core";
import { ThreadMetadata } from "@/liveblocks.config";

type Props = {
  thread: ThreadData<ThreadMetadata>;
  onFocus: (threadId: string) => void;
};

export function PinnedThread({ thread, onFocus, ...rest }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>PinnedThread</p>
    </div>
  );
}
