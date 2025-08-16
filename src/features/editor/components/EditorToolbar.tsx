import { FC } from "react";
import { Editor, TActiveTool } from "../types/editor";
import Hint from "./Hint";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RxTransparencyGrid } from "react-icons/rx";
import { isTextType } from "../utils/text";

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

  const isTextSelected = isTextType(selectedObjectType);
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
        </div>
      )}
    </div>
  );
};

export default EditorToolbar;
