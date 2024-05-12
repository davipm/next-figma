"use client";

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useCreateThread } from "@/liveblocks.config";
import { useMaxZIndex } from "@/hooks/use-max-zIndex";
import { Slot } from "@radix-ui/react-slot";
import * as Portal from "@radix-ui/react-portal";
import { PinnedComposer } from "@/components/comments/pinned-composer";
import { ComposerSubmitComment } from "@liveblocks/react-comments/primitives";
import { NewThreadCursor } from "@/components/comments/new-thread-cursor";

type ComposerCoords = null | {
  x: number;
  y: number;
};

type Props = {
  children: ReactNode;
};

enum State {
  Placing = "placing",
  Placed = "placed",
  Complete = "complete",
}

export function NewThread({ children }: Props) {
  const createThread = useCreateThread();
  const maxZIndex = useMaxZIndex();

  const [allowUserComposer, setAllowUserComposer] = useState(false);
  const [composerCoords, setComposerCoords] = useState<ComposerCoords>(null);
  const [creatingCommentState, setCreatingCommentState] = useState<State>(
    State.Complete,
  );

  const lastPointerEvent = useRef<PointerEvent>();
  const allowComposerRef = useRef(allowUserComposer);

  allowComposerRef.current = allowUserComposer;

  useEffect(() => {
    if (creatingCommentState === State.Complete) return;

    const newComment = (e: MouseEvent) => {
      e.preventDefault();

      if (creatingCommentState === State.Placed) {
        const isClickOnComposer = ((e as any)._savedComposedPath = e
          .composedPath()
          .some((el: any) => {
            return el.classList?.contains("lb-composer-editor-actions");
          }));

        if (isClickOnComposer) return;

        if (!isClickOnComposer) {
          setCreatingCommentState(State.Complete);
          return;
        }
      }

      setCreatingCommentState(State.Placed);

      setComposerCoords({
        x: e.clientX,
        y: e.clientY,
      });
    };

    document.addEventListener("click", newComment);

    return () => {
      document.removeEventListener("click", newComment);
    };
  }, [creatingCommentState]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      (e as any)._savedComposedPath = e.composedPath();
      lastPointerEvent.current = e;
    };

    document.documentElement.addEventListener("pointermove", handlePointerMove);

    return () => {
      document.documentElement.removeEventListener(
        "pointermove",
        handlePointerMove,
      );
    };
  }, []);

  const handleComposerSubmit = useCallback(
    ({ body }: ComposerSubmitComment, event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      // Get your canvas element
      const overlayPanel = document.querySelector("#canvas");

      // if there's no composer coords or last pointer event, meaning the user hasn't clicked yet, don't do anything
      if (!composerCoords || !lastPointerEvent.current || !overlayPanel) {
        return;
      }

      // Set coords relative to the top left of your canvas
      const { top, left } = overlayPanel.getBoundingClientRect();
      const x = composerCoords.x - left;
      const y = composerCoords.y - top;

      // create a new thread with the composer coords and cursor selectors
      createThread({
        body,
        metadata: {
          x,
          y,
          resolved: false,
          zIndex: maxZIndex + 1,
        },
      });

      setComposerCoords(null);
      setCreatingCommentState(State.Complete);
      setAllowUserComposer(false);
    },
    [createThread, composerCoords, maxZIndex],
  );

  return (
    <>
      <Slot
        style={{ opacity: creatingCommentState !== State.Complete ? 0.7 : 1 }}
        onClick={() =>
          setCreatingCommentState(
            creatingCommentState !== State.Complete
              ? State.Complete
              : State.Placing,
          )
        }
      >
        {children}
      </Slot>

      {composerCoords && creatingCommentState === State.Placed ? (
        <Portal.Root
          style={{
            pointerEvents: allowUserComposer ? "initial" : "none",
            transform: `translate(${composerCoords.x}px, ${composerCoords.y}px)`,
          }}
          className="absolute left-0 top-0"
          data-hide-cursors
        >
          <PinnedComposer onComposerSubmit={handleComposerSubmit} />
        </Portal.Root>
      ) : null}

      <NewThreadCursor display={creatingCommentState === State.Placing} />
    </>
  );
}
