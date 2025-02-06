import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  lightShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  floatingTimer: {
    position: "absolute",
    right: 16,
    zIndex: 50,
  },
  floatingFinish: {
    position: "absolute",
    right: 16,
    bottom: 60,
    zIndex: 50,
  },
  floatingShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  draggableCard: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
}); 