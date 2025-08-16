export type TActiveTool = "image" | "text" | "select";

export interface Editor {
  addImage: (value: string) => void;
}
