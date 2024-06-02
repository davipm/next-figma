import { MutableRefObject, useState } from "react";

type Props = {
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  undo: () => void;
  redo: () => void;
};

export function Live({ redo, undo, canvasRef }: Props) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>Live</p>
    </div>
  );
}
