import React from "react";
import { Animated, Text } from "react-native";
import { styles } from "./styles";

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  const [translateY] = React.useState(new Animated.Value(20));
  const [opacity] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Animate out after 600ms
    const timeout = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }, 600);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[styles.toast, { opacity, transform: [{ translateY }] }]}
    >
      <Text style={styles.toastText}>{message}</Text>
    </Animated.View>
  );
}
