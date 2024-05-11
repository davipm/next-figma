"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { CommentsOverlay } from "@/components/comments/comments-overlay";

export function Comments() {
  return (
    <ClientSideSuspense fallback={null}>
      {() => <CommentsOverlay />}
    </ClientSideSuspense>
  );
}
