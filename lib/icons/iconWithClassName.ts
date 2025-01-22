import type { LucideIcon } from 'lucide-react-native';

export function iconWithClassName(Icon: LucideIcon) {
  Icon.displayName = `${Icon.displayName}WithClassName`;
  return Icon;
} 