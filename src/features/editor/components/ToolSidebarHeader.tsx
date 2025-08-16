import { FC } from "react";

interface ToolSidebarHeaderProps {
  title: string;
  description: string;
}

const ToolSidebarHeader: FC<ToolSidebarHeaderProps> = ({
  title,
  description,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="text-lg">{title}</h2>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default ToolSidebarHeader;
