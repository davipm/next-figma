"use client";

import { ShapesMenuProps } from "@/types/type";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ShapesMenu({
  item,
  activeElement,
  handleActiveElement,
  handleImageUpload,
  imageInputRef,
}: ShapesMenuProps) {
  const isDropdownElem = item.value.some(
    (elem) => elem?.value === activeElement.value,
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger></DropdownMenuTrigger>
        <DropdownMenuTrigger></DropdownMenuTrigger>
      </DropdownMenu>

      <input
        type="file"
        className="hidden"
        ref={imageInputRef}
        accept="image/*"
        onChange={handleImageUpload}
      />
    </>
  );
}
