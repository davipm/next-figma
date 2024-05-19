import {
  ThreadMetadata,
  useEditThreadMetadata,
  useThreads,
  useUser,
} from "@/liveblocks.config";
import { ThreadData } from "@liveblocks/core";
import { useCallback, useRef } from "react";
import { PinnedThread } from "@/components/comments/pinned-thread";
import { useMaxZIndex } from "@/hooks/use-max-zIndex";

/**
 * OverlayThreadProps Type
 *
 * Defines the properties expected by the OverlayThread component.
 *
 * @property {ThreadData<ThreadMetadata>} thread - The thread data to be displayed.
 * @property {number} maxZIndex - The maximum z-index value for layering threads.
 */
type OverlayThreadProps = {
  thread: ThreadData<ThreadMetadata>;
  maxZIndex: number;
};

/**
 * CommentsOverlay Component
 *
 * This component is responsible for displaying a list of unresolved comment threads.
 * It retrieves the list of threads using the `useThreads` hook and filters out the resolved threads.
 * Each unresolved thread is then rendered using the `OverlayThread` component.
 *
 */
export function CommentsOverlay() {
  const { threads } = useThreads();
  const maxZIndex = useMaxZIndex();

  // Filter to get only unresolved threads
  const unsolvedThread = threads.filter((thread) => !thread.metadata.resolved);

  return (
    <div>
      {unsolvedThread.map((thread) => (
        <OverlayThread key={thread.id} thread={thread} maxZIndex={maxZIndex} />
      ))}
    </div>
  );
}

/**
 * OverlayThread Component
 *
 * This component represents an individual comment thread overlay. It allows users to interact
 * with the thread and dynamically adjust its z-index for layering purposes.
 *
 * @param {OverlayThreadProps} props - The properties for the OverlayThread component.
 *
 */
const OverlayThread = ({ thread, maxZIndex }: OverlayThreadProps) => {
  const editThreadMetadata = useEditThreadMetadata();
  const { isLoading } = useUser(thread.comments[0].userId);

  const threadRef = useRef<HTMLDivElement>(null);

  // Function to handle increasing the z-index of a thread
  const handleIncreaseZIndex = useCallback(() => {
    if (maxZIndex === thread.metadata.zIndex) return;

    editThreadMetadata({
      threadId: thread.id,
      metadata: {
        zIndex: maxZIndex + 1,
      },
    });
  }, [thread, editThreadMetadata, maxZIndex]);

  // If user data is loading, do not render the thread
  if (isLoading) return null;

  return (
    <div
      ref={threadRef}
      id={`thread-${thread.id}`}
      className="absolute left-0 top-0 flex gap-5"
      style={{
        transform: `translate(${thread.metadata.x}px, ${thread.metadata.y}px)`,
      }}
    >
      <PinnedThread thread={thread} onFocus={handleIncreaseZIndex} />
    </div>
  );
};
