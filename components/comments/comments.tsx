"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { CommentsOverlay } from "@/components/comments/comments-overlay";

/**
 * Comments Component
 *
 * This component is responsible for displaying a comments overlay
 * using client-side suspense. It uses `ClientSideSuspense` from
 * `@liveblocks/react` to handle the loading state on the client side
 * and renders the `CommentsOverlay` component when the content is ready.
 *
 */

export function Comments() {
  return (
    <ClientSideSuspense fallback={null}>
      {() => <CommentsOverlay />}
    </ClientSideSuspense>
  );
}
