import { useState } from "react";
import { NavbarProps } from "@/types/type";

export function Navbar({
  activeElement,
  imageInputRef,
  handleImageUpload,
  handleActiveElement,
}: NavbarProps) {
  const [item, setItem] = useState(null);

  return (
    <div>
      <p>Navbar</p>
    </div>
  );
}
