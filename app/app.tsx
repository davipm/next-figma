"use client";

import { useRef } from "react";
import { fabric } from "fabric";
import { useRedo, useStorage, useUndo } from "@/liveblocks.config";

export default function App() {
  const undo = useUndo();
  const redo = useRedo();

  // @ts-ignore
  const canvasObjects = useStorage((root) => root.canvasObjects);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Canvas | null>(null);

  return (
    <div>
      <p>App</p>
    </div>
  );
}
