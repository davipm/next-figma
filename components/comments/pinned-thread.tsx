import Image from "next/image";
import { useMemo, useState } from "react";
import { ThreadData } from "@liveblocks/core";
import { ThreadMetadata } from "@/liveblocks.config";
import { Thread } from "@liveblocks/react-comments";

/**
 * Props Type
 *
 * Defines the properties expected by the PinnedThread component.
 *
 * @property {ThreadData<ThreadMetadata>} thread - The thread data to be displayed.
 * @property {(threadId: string) => void} onFocus - Function to handle focus event on the thread.
 */
type Props = {
  thread: ThreadData<ThreadMetadata>;
  onFocus: (threadId: string) => void;
};

/**
 * PinnedThread Component
 *
 * This component represents a pinned thread, allowing users to interact with it and
 * toggle its minimized state. It displays a user avatar and the thread content when not minimized.
 *
 * @param {Props} props - The properties for the PinnedThread component.
 */
export function PinnedThread({ thread, onFocus, ...rest }: Props) {
  // Determine if the thread should start minimized based on its creation time
  const startMinimized = useMemo(() => {
    return Number(new Date()) - Number(new Date(thread.createdAt)) > 100;
  }, [thread.createdAt]);

  const [minimized, setMinimized] = useState(startMinimized);

  // Memoize the content to avoid unnecessary re-renders
  const memoizedContent = useMemo(() => {
    return (
      <div
        className="absolute flex cursor-pointer gap-4"
        {...rest}
        onClick={(event: any) => {
          onFocus(thread.id);

          // Ignore clicks on specific elements to prevent minimizing the thread
          if (
            event.target &&
            event.target.classList.contains("lb-icon") &&
            event.target.classList.contains("lb-button-icon")
          ) {
            return;
          }

          setMinimized(!minimized);
        }}
      >
        <div
          data-draggable={true}
          className="relative flex h-9 w-9 select-none items-center justify-center rounded-bl-full rounded-br-full rounded-tl-md rounded-tr-full bg-white shadow"
        >
          <Image
            alt="Dummy Name"
            width={28}
            height={28}
            draggable={false}
            src={`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}
            className="rounded-full"
          />
        </div>

        {!minimized ? (
          <div>
            <Thread
              thread={thread}
              indentCommentContent={false}
              onKeyUp={(event) => {
                event.stopPropagation();
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }, [minimized, thread.comments.length]);

  return <>{memoizedContent}</>;
}
