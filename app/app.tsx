"use client";

import { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { useMutation, useRedo, useStorage, useUndo } from "@/liveblocks.config";
import { Navbar } from "@/components/navbar";
import { ActiveElement, Attributes } from "@/types/type";
import { handleImageUpload } from "@/lib/shapes";

import { defaultNavElement } from "@/constants";
import {
  handleCanvaseMouseMove,
  handleCanvasMouseDown,
  handleCanvasMouseUp,
  handleCanvasObjectModified,
  handleCanvasObjectMoving,
  handleCanvasObjectScaling,
  handleCanvasSelectionCreated,
  handleCanvasZoom,
  handlePathCreated,
  handleResize,
  initializeFabric,
  renderCanvas,
} from "@/lib/canvas";
import { handleDelete, handleKeyDown } from "@/lib/key-events";
import { LeftSidebar } from "@/components/left-sidebar";
import { Live } from "@/components/live";
import { RightSidebar } from "@/components/right-sidebar";

export default function App() {
  const undo = useUndo();
  const redo = useRedo();

  const canvasObjects = useStorage((root) => root.canvasObjects);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  const isDrawing = useRef(false);
  const shapeRef = useRef<fabric.Object | null>(null);
  const selectedShapeRef = useRef<string | null>(null);
  const activeObjectRef = useRef<fabric.Object | null>(null);
  const isEditingRef = useRef(false);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [activeElement, setActiveElement] = useState<ActiveElement>({
    name: "",
    value: "",
    icon: "",
  });

  const [elementAttributes, setElementAttributes] = useState<Attributes>({
    width: "",
    height: "",
    fontSize: "",
    fontFamily: "",
    fontWeight: "",
    fill: "#aabbcc",
    stroke: "#aabbcc",
  });

  const deleteShapeFromStorage = useMutation(({ storage }, shapeId) => {
    const canvasObjects = storage.get("canvasObjects");
    canvasObjects.delete(shapeId);
  }, []);

  const deleteAllShapes = useMutation(({ storage }) => {
    const canvasObjects = storage.get("canvasObjects");

    if (!canvasObjects || canvasObjects.size === 0) return true;

    // @ts-ignore
    for (const [key, value] of canvasObjects.entries()) {
      canvasObjects.delete(key);
    }

    return canvasObjects.size === 0;
  }, []);

  const syncShapeInStorage = useMutation(({ storage }, object) => {
    if (!object) return;
    const { objectId } = object;

    const shapeData = object.toJSON();
    shapeData.objectId = objectId;

    const canvasObjects = storage.get("canvasObjects");

    canvasObjects.set(objectId, shapeData);
  }, []);

  // const handleActiveElement = (elem: ActiveElement) => {
  //   setActiveElement(elem);
  //
  //   switch (elem?.value) {
  //     case "reset":
  //       deleteAllShapes();
  //       fabricRef.current?.clear();
  //       setActiveElement(defaultNavElement);
  //       break;
  //     case "delete":
  //       handleDelete(fabricRef.current as any, deleteShapeFromStorage);
  //       setActiveElement(defaultNavElement);
  //       break;
  //     case "image":
  //       imageInputRef.current?.click();
  //       isDrawing.current = false;
  //       if (fabricRef.current) {
  //         fabricRef.current.isDrawingMode = false;
  //       }
  //       break;
  //     case "comments":
  //       break;
  //     default:
  //       selectedShapeRef.current = elem?.value as string;
  //       break;
  //   }
  // };

  const handleActiveElement = (elem: ActiveElement) => {
    setActiveElement(elem);

    if (!elem?.value) return;

    const actions = new Map<string, () => void>([
      ["reset", handleReset],
      ["delete", handleDeleteAction],
      ["image", handleImageInput],
      ["comments", () => {}], // No operation for comments
    ]);

    const action = actions.get(elem.value);
    if (action) {
      action();
    } else {
      handleDefaultAction(elem.value);
    }
  };

  const handleReset = () => {
    deleteAllShapes();
    fabricRef.current?.clear();
    setActiveElement(defaultNavElement);
  };

  const handleDeleteAction = () => {
    if (fabricRef.current) {
      handleDelete(fabricRef.current, deleteShapeFromStorage);
    }
    setActiveElement(defaultNavElement);
  };

  const handleImageInput = () => {
    imageInputRef.current?.click();
    isDrawing.current = false;
    if (fabricRef.current) {
      fabricRef.current.isDrawingMode = false;
    }
  };

  const handleDefaultAction = (value: string) => {
    selectedShapeRef.current = value;
  };

  useEffect(() => {
    const canvas = initializeFabric({
      canvasRef,
      fabricRef,
    });

    canvas.on("mouse:down", (options) => {
      handleCanvasMouseDown({
        options,
        canvas,
        selectedShapeRef,
        isDrawing,
        shapeRef,
      });
    });

    canvas.on("mouse:move", (options) => {
      handleCanvaseMouseMove({
        options,
        canvas,
        isDrawing,
        selectedShapeRef,
        shapeRef,
        syncShapeInStorage,
      });
    });

    canvas.on("mouse:up", () => {
      handleCanvasMouseUp({
        canvas,
        isDrawing,
        shapeRef,
        activeObjectRef,
        selectedShapeRef,
        syncShapeInStorage,
        setActiveElement,
      });
    });

    canvas.on("path:created", (options) => {
      handlePathCreated({
        options,
        syncShapeInStorage,
      });
    });

    canvas.on("object:modified", (options) => {
      handleCanvasObjectModified({
        options,
        syncShapeInStorage,
      });
    });

    canvas?.on("object:moving", (options) => {
      handleCanvasObjectMoving({
        options,
      });
    });

    canvas.on("selection:created", (options) => {
      handleCanvasSelectionCreated({
        options,
        isEditingRef,
        setElementAttributes,
      });
    });

    canvas.on("object:scaling", (options) => {
      handleCanvasObjectScaling({
        options,
        setElementAttributes,
      });
    });

    canvas.on("mouse:wheel", (options) => {
      handleCanvasZoom({
        options,
        canvas,
      });
    });

    window.addEventListener("resize", () => {
      handleResize({
        canvas: fabricRef.current,
      });
    });

    window.addEventListener("keydown", (e) =>
      handleKeyDown({
        e,
        canvas: fabricRef.current,
        undo,
        redo,
        syncShapeInStorage,
        deleteShapeFromStorage,
      }),
    );

    return () => {
      canvas.dispose();

      window.removeEventListener("resize", () => {
        handleResize({
          canvas: null,
        });
      });

      window.removeEventListener("keydown", (e) =>
        handleKeyDown({
          e,
          // eslint-disable-next-line react-hooks/exhaustive-deps
          canvas: fabricRef.current,
          undo,
          redo,
          syncShapeInStorage,
          deleteShapeFromStorage,
        }),
      );
    };
  }, [canvasRef]); // run this effect only once when the component mounts and the canvasRef changes

  useEffect(() => {
    renderCanvas({
      fabricRef,
      canvasObjects,
      activeObjectRef,
    });
  }, [canvasObjects]);

  return (
    <main className="h-screen overflow-hidden">
      <Navbar
        activeElement={activeElement}
        imageInputRef={imageInputRef}
        handleImageUpload={(event: any) => {
          event.stopPropagation();
          handleImageUpload({
            file: event.target.files[0],
            canvas: fabricRef as any,
            shapeRef,
            syncShapeInStorage,
          });
        }}
        handleActiveElement={handleActiveElement}
      />

      <section className="flex h-full flex-row">
        <LeftSidebar allShapes={Array.from(canvasObjects)} />
        <Live canvasRef={canvasRef} undo={undo} redo={redo} />
        <RightSidebar
          elementAttributes={elementAttributes}
          setElementAttributes={setElementAttributes}
          fabricRef={fabricRef}
          activeObjectRef={activeObjectRef}
          isEditingRef={isEditingRef}
          syncShapeInStorage={syncShapeInStorage}
        />
      </section>
    </main>
  );
}
