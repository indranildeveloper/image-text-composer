import { FC, useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import ToolSidebarHeader from "./ToolSidebarHeader";
import ToolSidebarClose from "./ToolSidebarClose";
import { Editor, TActiveTool } from "../types/editor";

interface OpacitySidebarProps {
  editor: Editor | undefined;
  activeTool: TActiveTool;
  onChangeActiveTool: (tool: TActiveTool) => void;
}

const OpacitySidebar: FC<OpacitySidebarProps> = ({
  editor,
  activeTool,
  onChangeActiveTool,
}) => {
  const initialOpacityValue = editor?.getActiveOpacity() ?? 1;
  const [opacity, setOpacity] = useState<number>(initialOpacityValue);

  const selectedObject = useMemo(() => {
    return editor?.selectedObjects[0];
  }, [editor?.selectedObjects]);

  useEffect(() => {
    if (selectedObject) {
      setOpacity((selectedObject.get("opacity") as number) ?? 1);
    }
  }, [selectedObject]);

  const handleCloseToolSidebar = () => {
    onChangeActiveTool("select");
  };

  const handleChangeOpacity = (value: number) => {
    editor?.changeOpacity(value);
    setOpacity(value);
  };

  return (
    <aside
      className={cn(
        "relative z-40 flex h-full w-[360px] flex-col border-r bg-white p-4",
        activeTool === "opacity" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Opacity"
        description="Change the opacity of the selected element."
      />

      <ScrollArea>
        <div className="space-y-4 border-b pb-6">
          <Label className="text-sm">Change Opacity</Label>
          <Slider
            value={[opacity]}
            onValueChange={(values) => handleChangeOpacity(values[0])}
            max={1}
            min={0}
            step={0.01}
          />
        </div>
      </ScrollArea>

      <ToolSidebarClose onClick={handleCloseToolSidebar} />
    </aside>
  );
};

export default OpacitySidebar;
