import { useState } from "react";
import { RightSidebarProps } from "@/types/type";

// import { Container } from "./styles";

export function RightSidebar({
  elementAttributes,
  setElementAttributes,
  fabricRef,
  activeObjectRef,
  isEditingRef,
  syncShapeInStorage,
}: RightSidebarProps) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>RightSidebar</p>
    </div>
  );
}
