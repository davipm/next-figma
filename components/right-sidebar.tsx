import { useMemo, useRef } from "react";
import { RightSidebarProps } from "@/types/type";
import { Dimensions } from "@/components/settings/dimensions";
import { modifyShape } from "@/lib/shapes";
import { fabric } from "fabric";

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

  // TODO: finishing

  return useMemo(
    () => (
      <section>
        <h3>Design</h3>
        <span>Make changes to canvas as you like</span>

        <Dimensions
          handleInputChange={handleInputChange}
          height={elementAttributes.height}
          isEditingRef={isEditingRef}
          width={elementAttributes.width}
        />
      </section>
    ),
    [],
  );
}
