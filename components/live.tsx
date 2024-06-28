import {
  MutableRefObject,
  useCallback,
  useEffect,
  useState,
  PointerEvent,
} from "react";
import {
  useBroadcastEvent,
  useEventListener,
  useMyPresence,
  useOthers,
} from "@/liveblocks.config";
import { CursorMode, CursorState, Reaction, ReactionEvent } from "@/types/type";
import { useInterval } from "@/hooks/use-interval";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FlyingReaction } from "@/components/reaction/flying-reaction";
import { Comments } from "@/components/comments/comments";
import { LiveCursors } from "@/components/cursor/live-cursors";
import { ReactionSelector } from "@/components/reaction/reaction-button";

type Props = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  undo: () => void;
  redo: () => void;
};

export function Live({ redo, undo, canvasRef }: Props) {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence() as any;
  const broadcast = useBroadcastEvent();

  const [reactions, setReactions] = useState<Reaction[]>([]);
  const [cursorState, setCursorState] = useState<CursorState>({
    mode: CursorMode.Hidden,
  });

  const setReaction = useCallback((reaction: string) => {
    setCursorState({ mode: CursorMode.Reaction, reaction, isPressed: false });
  }, []);

  useInterval(() => {
    setReactions((reactions) =>
      reactions.filter((reaction) => reaction.timestamp > Date.now() - 4000),
    );
  }, 1000);

  useInterval(() => {
    if (
      cursorState.mode === CursorMode.Reaction &&
      cursorState.isPressed &&
      cursor
    ) {
      setReactions((reaction) =>
        reaction.concat([
          {
            point: { x: cursor.x, y: cursor.y },
            value: cursorState.reaction,
            timestamp: Date.now(),
          },
        ]),
      );

      broadcast({
        x: cursor.x,
        y: cursor.y,
        value: cursorState.reaction,
      });
    }
  }, 100);

  useEventListener((eventData) => {
    const event = eventData.event as ReactionEvent;
    setReactions((reactions) =>
      reactions.concat([
        {
          point: { x: event.x, y: event.y },
          value: event.value,
          timestamp: Date.now(),
        },
      ]),
    );
  });

  useEffect(() => {
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === "/") {
        setCursorState({
          mode: CursorMode.Chat,
          previousMessage: null,
          message: "",
        });
      } else if (event.key === "Escape") {
        updateMyPresence({ message: "" });
        setCursorState({ mode: CursorMode.Hidden });
      } else if (event.key === "e") {
        setCursorState({ mode: CursorMode.ReactionSelector });
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
      }
    };

    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [updateMyPresence]);

  const handlePointerMove = useCallback((event: PointerEvent) => {
    event.preventDefault();

    if (cursor === null || cursorState.mode !== CursorMode.ReactionSelector) {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientX - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({
        cursor: { x, y },
      });
    }
  }, []);

  const handlePointLeave = useCallback(() => {
    setCursorState({
      mode: CursorMode.Hidden,
    });

    updateMyPresence({
      cursor: null,
      message: null,
    });
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent) => {
      const x = event.clientX - event.currentTarget.getBoundingClientRect().x;
      const y = event.clientX - event.currentTarget.getBoundingClientRect().y;

      updateMyPresence({ cursor: { x, y } });

      setCursorState((state) =>
        cursorState.mode === CursorMode.Reaction
          ? { ...state, isPressed: true }
          : state,
      );
    },
    [cursorState.mode, updateMyPresence],
  );

  const handlePointerUp = useCallback(() => {
    setCursorState((state: CursorState) =>
      cursorState.mode === CursorMode.Reaction
        ? { ...state, isPressed: false }
        : state,
    );
  }, [cursorState.mode, setCursorState]);

  const handleContextMenuClick = useCallback((key: string) => {
    const actions = new Map<string, () => void>([
      ["Chat", handleChat],
      ["Reactions", handleReactions],
      ["Undo", undo],
      ["Redo", redo],
    ]);

    const action = actions.get(key);
    if (action) {
      action();
    }
  }, []);

  const handleChat = () => {
    setCursorState({
      mode: CursorMode.Chat,
      previousMessage: null,
      message: "",
    });
  };

  const handleReactions = () => {
    setCursorState({ mode: CursorMode.ReactionSelector });
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className="relative flex h-full w-full flex-1 items-center justify-center"
        id="canvas"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        style={{
          cursor: cursorState.mode === CursorMode.Chat ? "none" : "auto",
        }}
      >
        <canvas ref={canvasRef} />

        {reactions.map((reaction) => (
          <FlyingReaction
            key={reaction.timestamp.toString()}
            timestamp={reaction.timestamp}
            value={reaction.value}
            x={reaction.point.x}
            y={reaction.point.y}
          />
        ))}

        {cursorState.mode === CursorMode.ReactionSelector && (
          <ReactionSelector
            setReaction={(reaction) => {
              setReaction(reaction);
            }}
          />
        )}

        <LiveCursors others={others} />

        <Comments />
      </ContextMenuTrigger>

      <ContextMenuContent></ContextMenuContent>
    </ContextMenu>
  );
}
