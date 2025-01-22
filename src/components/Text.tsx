import { Text as RNText, TextProps as RNTextProps } from "react-native";
import React from "react";

interface TextProps extends RNTextProps {
  variant?: "regular" | "medium" | "bold";
}

export const Text = ({ variant = "regular", style, ...props }: TextProps) => {
  const fontFamily = {
    regular: undefined,
    medium: undefined,
    bold: undefined,
  }[variant];

  return (
    <RNText
      style={[
        {
          fontFamily,
        },
        style,
      ]}
      {...props}
    />
  );
};
