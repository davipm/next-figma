import { useState } from "react";
import { DEFAULT_CURSOR_POSITION } from "@/constants";

export function NewThreadCursor({ display }: { display: boolean }) {
  const [coords, setCoords] = useState({
    x: DEFAULT_CURSOR_POSITION,
    y: DEFAULT_CURSOR_POSITION,
  });

  if (!display) return null;

  return (
    <div>
      <p></p>
    </div>
  );
}
