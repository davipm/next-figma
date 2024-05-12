import Image from "next/image";
import { Composer, ComposerProps } from "@liveblocks/react-comments";

type Props = {
  onComposerSubmit: ComposerProps["onComposerSubmit"];
};

export function PinnedComposer({ onComposerSubmit, ...rest }: Props) {
  return (
    <div>
      <p></p>
    </div>
  );
}
