import { LiveCursorProps } from "@/types/type";
import { COLORS } from "@/constants";
import { Cursor } from "@/components/cursor/cursor";

export function LiveCursors({ others }: LiveCursorProps) {
  return others.map(({ connectionId, presence }) => {
    if (presence === null || !presence?.cursor) {
      return null;
    }

    return (
      <Cursor
        key={connectionId}
        color={COLORS[Number(connectionId) % COLORS.length]}
        x={presence.cursor.x}
        y={presence.cursor.y}
        message={presence.message}
      />
    );
  });
}
