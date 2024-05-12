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

type OverlayThreadProps = {
  thread: ThreadData<ThreadMetadata>;
  maxZIndex: number;
};

export function CommentsOverlay() {
  const { threads } = useThreads();
  const maxZIndex = useMaxZIndex();

  const unsolvedThread = threads.filter((thread) => !thread.metadata.resolved);

  return (
    <div>
      {unsolvedThread.map((thread) => (
        <OverlayThread key={thread.id} thread={thread} maxZIndex={maxZIndex} />
      ))}
    </div>
  );
}

const OverlayThread = ({ thread, maxZIndex }: OverlayThreadProps) => {
  const editThreadMetadata = useEditThreadMetadata();
  const { isLoading } = useUser(thread.comments[0].userId);

  const threadRef = useRef<HTMLDivElement>(null);

  const handleIncreaseZIndex = useCallback(() => {
    if (maxZIndex === thread.metadata.zIndex) return;
    editThreadMetadata({
      threadId: thread.id,
      metadata: {
        zIndex: maxZIndex + 1,
      },
    });
  }, [thread, editThreadMetadata, maxZIndex]);

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
