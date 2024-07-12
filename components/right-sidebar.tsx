import { useMemo, useRef } from "react";
import { RightSidebarProps } from "@/types/type";
import { Dimensions } from "@/components/settings/dimensions";
import { modifyShape } from "@/lib/shapes";
import { fabric } from "fabric";
import { Text } from "@/components/settings/text";
import { Export } from "@/components/settings/export";
import { Color } from "@/components/settings/color";

export function RightSidebar({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
}: RightSidebarProps) {
  const colorInputRef = useRef(null);
  const strokeInputRef = useRef(null);

  const handleInputChange = (property: string, value: string) => {
    if (!isEditingRef.current) isEditingRef.current = true;

    setElementAttributes((prev) => ({
      ...prev,
      [property]: value,
    }));

    modifyShape({
      canvas: fabricRef.current as fabric.Canvas,
      property,
      value,
      activeObjectRef,
      syncShapeInStorage,
    });
  };

  return useMemo(
    () => (
      <section className="flex flex-col border-t border-primary-grey-200 bg-primary-black text-primary-grey-300 min-w-[227px] sticky right-0 h-full max-sm:hidden select-none">
        <h3>Design</h3>
        <span>Make changes to canvas as you like</span>

        <Dimensions
          handleInputChange={handleInputChange}
          height={elementAttributes.height}
          isEditingRef={isEditingRef}
          width={elementAttributes.width}
        />

        <Text
          fontFamily={elementAttributes.fontFamily}
          fontSize={elementAttributes.fontSize}
          fontWeight={elementAttributes.fontWeight}
          handleInputChange={handleInputChange}
        />

        <Color
          attribute="fill"
          placeholder="Color"
          attributeType={elementAttributes.fill}
          handleInputChange={handleInputChange}
          inputRef={colorInputRef}
        />

        <Color
          attribute="stroke"
          placeholder="Stroke"
          attributeType={elementAttributes.stroke}
          handleInputChange={handleInputChange}
          inputRef={strokeInputRef}
        />

        <Export />
      </section>
    ),
    [elementAttributes],
  );
}
