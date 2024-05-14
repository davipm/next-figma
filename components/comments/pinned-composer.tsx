import Image from "next/image";
import { Composer, ComposerProps } from "@liveblocks/react-comments";

type Props = {
  onComposerSubmit: ComposerProps["onComposerSubmit"];
};

export function PinnedComposer({ onComposerSubmit, ...rest }: Props) {
  return (
    <div className="absolute flex gap-4" {...rest}>
      <div className="select-none relative w-9 h-9 shadow rounded-tl-md rounded-tr-full rounded-br-full rounded-bl-full bg-white flex justify-center items-center">
        <Image
          alt="someone"
          width={28}
          height={28}
          src={`https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`}
          className="rounded-full"
        />
      </div>

      <div className="shadow bg-white rounded-lg flex flex-col text-sm min-w-9 overflow-hidden p-2">
        <Composer
          onComposerSubmit={onComposerSubmit}
          autoFocus={true}
          onKeyUp={(event) => {
            event.stopPropagation();
          }}
        />
      </div>
    </div>
  );
}
