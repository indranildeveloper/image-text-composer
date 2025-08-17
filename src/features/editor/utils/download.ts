import { v4 as uuidv4 } from "uuid";

export const downloadFile = (file: string, type: string) => {
  const anchorElement = document.createElement("a");
  anchorElement.href = file;
  anchorElement.download = `${uuidv4()}.${type}`;
  document.body.appendChild(anchorElement);
  anchorElement.click();
  anchorElement.remove();
};
