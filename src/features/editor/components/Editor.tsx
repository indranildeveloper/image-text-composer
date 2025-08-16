import { FC } from "react";
import EditorNavbar from "./EditorNavbar";
import EditorSidebar from "./EditorSidebar";
import EditorToolbar from "./EditorToolbar";

const Editor: FC = () => {
  return (
    <div className="flex h-screen flex-col">
      <EditorNavbar />
      <div className="flex h-[calc(100vh-70px)]">
        <EditorSidebar />
        <main className="w-full">
          <EditorToolbar />
        </main>
      </div>
    </div>
  );
};

export default Editor;
