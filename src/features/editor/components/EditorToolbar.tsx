import { FC, useState } from "react";
import { Editor, TActiveTool } from "../types/editor";
import Hint from "./Hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RxTransparencyGrid } from "react-icons/rx";
import { FaBold } from "react-icons/fa";
import { isTextType } from "../utils/text";
import { FONT_WEIGHT } from "../constants/editor";

interface EditorToolbarProps {
  key: string;
  editor: Editor | undefined;
  activeTool: TActiveTool;
  onChangeActiveTool: (tool: TActiveTool) => void;
}

const EditorToolbar: FC<EditorToolbarProps> = ({
  editor,
  activeTool,
  onChangeActiveTool,
}) => {
  const selectedObjectType = editor?.selectedObjects[0]?.type;
  const selectedObject = editor?.selectedObjects[0];
  const isTextSelected = isTextType(selectedObjectType);

  const initialFillColor = editor?.getActiveFillColor();
  const initialFontWeight = editor?.getActiveFontWeight() ?? FONT_WEIGHT;

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    fontWeight: initialFontWeight,
  });

  const toggleBold = () => {
    if (!selectedObject) return;

    const newValue = properties.fontWeight > 500 ? 500 : 700;

    editor?.changeFontWeight(newValue);
    setProperties((prevProperties) => ({
      ...prevProperties,
      fontWeight: newValue,
    }));
  };

  return (
    <div className="h-[50px] w-full border-b">
      {isTextSelected && (
        <div className="flex h-full items-center gap-2 px-2">
          <div className="flex h-full items-center">
            <Hint label="Opacity" side="bottom">
              <Button
                onClick={() => onChangeActiveTool("opacity")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "opacity" && "bg-slate-100")}
              >
                <RxTransparencyGrid className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex h-full items-center justify-center">
            <Hint label="Color" side="bottom">
              <Button
                onClick={() => onChangeActiveTool("fill")}
                size="icon"
                variant="ghost"
                className={cn(activeTool === "fill" && "bg-slate-100")}
              >
                <div
                  className="size-4 rounded-sm border"
                  style={{
                    backgroundColor: properties.fillColor,
                  }}
                />
              </Button>
            </Hint>
          </div>
          <div className="flex h-full items-center justify-center">
            <Hint label="Bold" side="bottom">
              <Button
                onClick={toggleBold}
                size="icon"
                variant="ghost"
                className={cn(properties.fontWeight > 500 && "bg-slate-100")}
              >
                <FaBold className="size-4" />
              </Button>
            </Hint>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
