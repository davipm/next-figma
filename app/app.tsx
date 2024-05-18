"use client";

import { useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { useRef } from "react";

export function App() {
  const undo = useUndo();
  const redo = useRedo();

  // @ts-ignore
  const canvasObjects = useStorage((root) => root.canvasObjects);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <div>
      <p></p>
    </div>
  );
}
