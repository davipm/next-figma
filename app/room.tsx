"use client";

import { ReactNode } from "react";
import { RoomProvider } from "@/liveblocks.config";
import { LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { Loader } from "@/components/loader";

export function Room({ children }: { children: ReactNode }) {
  return (
    <RoomProvider
      id="fig-room"
      initialPresence={{ cursor: null, cursorColor: null, editingText: null }}
      initialStorage={{ canvasObjects: new LiveMap() }}
    >
      <ClientSideSuspense fallback={<Loader />}>
        {() => children}
      </ClientSideSuspense>
    </RoomProvider>
  );
}
