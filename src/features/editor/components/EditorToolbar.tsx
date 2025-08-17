import { FC, useState } from "react";
import { Editor, TActiveTool } from "../types/editor";
import Hint from "./Hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RxTransparencyGrid } from "react-icons/rx";
import { FaBold, FaItalic, FaStrikethrough, FaUnderline } from "react-icons/fa";
import { isTextType } from "../utils/text";
import { FONT_SIZE, FONT_WEIGHT, TEXT_ALIGN } from "../constants/editor";
import { ITextboxOptions } from "fabric/fabric-impl";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  CopyIcon,
} from "lucide-react";
import FontSizeInput from "./FontSizeInput";

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
  const initialTextAlign = editor?.getActiveTextAlign() ?? TEXT_ALIGN;
  const initialFontSize = editor?.getActiveFontSize() ?? FONT_SIZE;
  const initialFontFamily = editor?.getActiveFontFamily();

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    fontWeight: initialFontWeight,
    fontStyle: initialFontStyle,
    fontUnderline: initialFontUnderline,
    fontLineThrough: initialFontLineThrough,
    textAlign: initialTextAlign,
    fontSize: initialFontSize,
    fontFamily: initialFontFamily,
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

  const handleChangeTextAlign = (value: ITextboxOptions["textAlign"]) => {
    if (!selectedObject) return;

    editor?.changeTextAlign(value);
    setProperties((prevProperties) => ({
      ...prevProperties,
      textAlign: value as string,
    }));
  };

  const handleChangeFontSize = (value: number) => {
    if (!selectedObject) return;
    editor.changeFontSize(value);
    setProperties((prevProperties) => ({
      ...prevProperties,
      fontSize: value,
    }));
  };

  return (
    <div className="h-[50px] w-full border-b">
      {isTextSelected && (
        <div className="flex h-full items-center gap-2 px-2">
          <div className="flex h-full items-center justify-center">
            <Hint label="Bring Forward" side="bottom">
              <Button
                onClick={() => editor?.bringForward()}
                size="icon"
                variant="ghost"
              >
                <ArrowUpIcon className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex h-full items-center justify-center">
            <Hint label="Send Backward" side="bottom">
              <Button
                onClick={() => editor?.sendBackward()}
                size="icon"
                variant="ghost"
              >
                <ArrowDownIcon className="size-4" />
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
            <Hint label="Font Family" side="bottom">
              <Button
                onClick={() => onChangeActiveTool("font")}
                variant="ghost"
                className={cn(
                  "w-auto",
                  activeTool === "font" && "bg-slate-100",
                )}
              >
                <div className="max-w-[100px] truncate">
                  {properties.fontFamily}
                </div>
                <ChevronDownIcon className="ml-2 size-4 shrink-0" />
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
          <div className="flex h-full items-center justify-center">
            <Hint label="Align Left" side="bottom">
              <Button
                onClick={() => handleChangeTextAlign("left")}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.textAlign === "left" && "bg-slate-100",
                )}
              >
                <AlignLeftIcon className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex h-full items-center justify-center">
            <Hint label="Align Center" side="bottom">
              <Button
                onClick={() => handleChangeTextAlign("center")}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.textAlign === "center" && "bg-slate-100",
                )}
              >
                <AlignCenterIcon className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex h-full items-center justify-center">
            <Hint label="Align Right" side="bottom">
              <Button
                onClick={() => handleChangeTextAlign("right")}
                size="icon"
                variant="ghost"
                className={cn(
                  properties.textAlign === "right" && "bg-slate-100",
                )}
              >
                <AlignRightIcon className="size-4" />
              </Button>
            </Hint>
          </div>
          <div className="flex h-full items-center justify-center">
            <FontSizeInput
              value={properties.fontSize}
              onChange={handleChangeFontSize}
            />
          </div>
          <div className="flex h-full items-center justify-center">
            <Hint label="Duplicate" side="bottom">
              <Button
                onClick={() => {
                  editor?.copyObject();
                  editor?.pasteObject();
                }}
                size="icon"
                variant="ghost"
              >
                <CopyIcon className="size-4" />
              </Button>
            </Hint>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
