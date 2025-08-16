"use client";

import { FC } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const SidebarItem: FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      className={cn(
        "hover:text-primary flex aspect-video flex-col items-center justify-center gap-1 rounded-md p-3 text-slate-700 transition hover:bg-slate-100",
        isActive && "text-primary bg-slate-100",
      )}
      onClick={onClick}
    >
      <Icon className="size-5" />
      <p className="text-sm">{label}</p>
    </button>
  );
};

export default SidebarItem;
