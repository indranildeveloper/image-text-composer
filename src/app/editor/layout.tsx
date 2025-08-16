import { FC } from "react";
import { EditorLayoutProps } from "@/interfaces/EditorLayoutProps";

const EditorLayout: FC<Readonly<EditorLayoutProps>> = ({ children }) => {
  return <div>{children}</div>;
};

export default EditorLayout;
