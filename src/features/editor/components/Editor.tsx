"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import EditorNavbar from "./EditorNavbar";
import EditorSidebar from "./EditorSidebar";
import EditorToolbar from "./EditorToolbar";
import ImageSidebar from "./ImageSidebar";
import TextSidebar from "./TextSidebar";
import { TActiveTool } from "../types/editor";
import { useEditor } from "../hooks/useEditor";

const Editor: FC = () => {
  const [activeTool, setActiveTool] = useState<TActiveTool>("image");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { init, editor } = useEditor();

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current!, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({ initialCanvas: canvas, initialContainer: containerRef.current! });

    return () => {
      canvas.dispose().catch((error) => {
        console.error("Canvas Error: ", error);
      });
    };
  }, [init]);

  const handleChangeActiveTool = useCallback(
    (tool: TActiveTool) => {
      if (tool === activeTool) {
        return setActiveTool("select");
      }

      setActiveTool(tool);
    },
    [activeTool],
  );

  return (
    <div className="flex h-screen flex-col">
      <EditorNavbar />
      <div className="flex h-[calc(100vh-70px)]">
        <EditorSidebar
          activeTool={activeTool}
          handleChangeActiveTool={handleChangeActiveTool}
        />
        <ImageSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={handleChangeActiveTool}
        />
        <TextSidebar
          activeTool={activeTool}
          onChangeActiveTool={handleChangeActiveTool}
        />
        <main className="w-full">
          <EditorToolbar />
          <div ref={containerRef} className="h-[calc(100vh-120px)] flex-1">
            <canvas ref={canvasRef} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Editor;
