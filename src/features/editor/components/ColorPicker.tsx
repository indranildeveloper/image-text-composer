"use client";

import { FC, useEffect, useState } from "react";
import { ChromePicker, CirclePicker } from "react-color";
import { colors } from "../constants/colors";
import { rgbaObjectToString } from "../utils/color";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

const ColorPicker: FC<ColorPickerProps> = ({ value, onChange }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="w-full space-y-4">
      <ChromePicker
        color={value}
        onChange={(color) => {
          const formattedValue = rgbaObjectToString(color.rgb);
          onChange(formattedValue);
        }}
        className="rounded-lg border"
      />
      <CirclePicker
        color={value}
        colors={colors}
        onChangeComplete={(color) => {
          const formattedValue = rgbaObjectToString(color.rgb);
          onChange(formattedValue);
        }}
      />
    </div>
  );
};

export default ColorPicker;
