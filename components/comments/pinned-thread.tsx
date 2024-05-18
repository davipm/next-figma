import Image from "next/image";
import { useMemo, useState } from "react";
import { ThreadData } from "@liveblocks/core";
import { ThreadMetadata } from "@/liveblocks.config";
import { Thread } from "@liveblocks/react-comments";

type Props = {
  thread: ThreadData<ThreadMetadata>;
  onFocus: (threadId: string) => void;
};

export function PinnedThread({ thread, onFocus, ...rest }: Props) {
  const startMinimized = useMemo(() => {
    return Number(new Date()) - Number(new Date(thread.createdAt)) > 100;
  }, [thread.createdAt]);

  const [minimized, setMinimized] = useState(startMinimized);

  const memoizedContent = useMemo(() => {
    return (
      <div
        className="absolute flex cursor-pointer gap-4"
        {...rest}
        onClick={(event: any) => {
          onFocus(thread.id);

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
