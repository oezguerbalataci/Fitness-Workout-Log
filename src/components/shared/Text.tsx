import { Text as RNText, TextProps, StyleSheet } from "react-native";
import { fonts } from "../../theme/fonts";

interface CustomTextProps extends TextProps {
  variant?: "regular" | "medium" | "bold";
}

export function Text({
  style,
  variant = "regular",
  ...props
}: CustomTextProps) {
  return (
    <RNText
      style={[styles.text, { fontFamily: fonts[variant] }, style]}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});
