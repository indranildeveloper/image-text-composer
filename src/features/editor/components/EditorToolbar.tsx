import { FC, useState } from "react";
import { Editor, TActiveTool } from "../types/editor";
import Hint from "./Hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RxTransparencyGrid } from "react-icons/rx";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
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
  const initialFontStyle = editor?.getActiveFontStyle();
  const initialFontUnderline = editor?.getActiveFontUnderline();
  const initialFontLineThrough = editor?.getActiveFontLineThrough();

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    fontWeight: initialFontWeight,
    fontStyle: initialFontStyle,
    fontUnderline: initialFontUnderline,
    fontLineThrough: initialFontLineThrough,
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

  const toggleItalic = () => {
    if (!selectedObject) return;

    const isItalic = properties.fontStyle === "italic";
    const newValue = isItalic ? "normal" : "italic";

    editor?.changeFontStyle(newValue);
    setProperties((prevProperties) => ({
      ...prevProperties,
      fontStyle: newValue,
    }));
  };

  const toggleUnderline = () => {
    if (!selectedObject) return;

    const newValue = properties.fontUnderline ? false : true;

    editor?.changeFontUnderline(newValue);
    setProperties((prevProperties) => ({
      ...prevProperties,
      fontUnderline: newValue,
    }));
  };

  const toggleLineThrough = () => {
    if (!selectedObject) return;

    const newValue = properties.fontLineThrough ? false : true;

    editor?.changeFontLineThrough(newValue);
    setProperties((prevProperties) => ({
      ...prevProperties,
      fontLineThrough: newValue,
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
          <div className="flex h-full items-center justify-center">
            <Hint label="Italic" side="bottom">
              <Button
                onClick={toggleItalic}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.fontStyle === "italic" && "bg-slate-100",
                )}
              >
                <FaItalic className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex h-full items-center justify-center">
            <Hint label="Underline" side="bottom">
              <Button
                onClick={toggleUnderline}
                size="icon"
                variant="ghost"
                className={cn(properties.fontUnderline && "bg-slate-100")}
              >
                <FaUnderline className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex h-full items-center justify-center">
            <Hint label="Strike" side="bottom">
              <Button
                onClick={toggleLineThrough}
                size="icon"
                variant="ghost"
                className={cn(properties.fontLineThrough && "bg-slate-100")}
              >
                <FaStrikethrough className="size-4" />
              </Button>
            </Hint>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
