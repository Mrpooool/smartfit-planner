import React, { useEffect, useRef } from "react";
import { Text, StyleSheet, Animated, Platform } from "react-native";
import { observer } from "mobx-react-lite";
import { uiStore } from "../../model/uiStore";

export const GlobalToast = observer(function GlobalToast() {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (uiStore.toastMessage) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: Platform.OS !== "web", // Web support via react-native-web
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: Platform.OS !== "web",
      }).start();
    }
  }, [uiStore.toastMessage, fadeAnim]);

  if (!uiStore.toastMessage && fadeAnim === 0) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim },
        uiStore.toastType === "warning" ? styles.warningBg : 
        uiStore.toastType === "success" ? styles.successBg : styles.infoBg,
      ]}
      pointerEvents="none"
    >
      <Text style={styles.text}>{uiStore.toastMessage}</Text>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: Platform.OS === "web" ? 30 : 60, // Avoid safe area on native
    alignSelf: "center",
    zIndex: 9999,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  successBg: {
    backgroundColor: "rgba(16, 185, 129, 0.95)", // Emerald green
  },
  warningBg: {
    backgroundColor: "rgba(245, 158, 11, 0.95)", // Amber orange
  },
  infoBg: {
    backgroundColor: "rgba(59, 130, 246, 0.95)", // Blue
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
