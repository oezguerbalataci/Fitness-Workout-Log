import { View, ViewProps } from "react-native";
import { cn } from "../../lib/utils";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "bg-white p-4 rounded-2xl shadow-sm border border-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
}
