import { FC } from "react";
import { ChevronsLeftIcon } from "lucide-react";

interface ToolSidebarCloseProps {
  onClick: () => void;
}

const ToolSidebarClose: FC<ToolSidebarCloseProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group absolute top-1/2 -right-[1.80rem] flex -translate-y-1/2 transform items-center justify-center rounded-r-full border-y border-r bg-white p-4 px-1 pr-2"
    >
      <ChevronsLeftIcon className="size-4 text-black transition group-hover:opacity-75" />
    </button>
  );
};

export default ToolSidebarClose;
