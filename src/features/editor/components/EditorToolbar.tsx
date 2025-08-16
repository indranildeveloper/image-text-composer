import { FC } from "react";
import { Editor, TActiveTool } from "../types/editor";

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
  return <div className="h-[50px] w-full border-b">EditorToolbar</div>;
};

export default EditorToolbar;
