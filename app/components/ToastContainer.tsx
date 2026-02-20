import React from "react";
import { View, Text, Animated } from "react-native";

export default function ToastContainer({ toasts }: { toasts: any[] }) {
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: "center",
      }}
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} message={toast.message} />
      ))}
    </View>
  );
}

function Toast({ message }: { message: string }) {
  const [translateY] = React.useState(new Animated.Value(20));
  const [opacity] = React.useState(new Animated.Value(0));

  React.useEffect(() => {
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
      style={{
        marginVertical: 4,
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: "#7C3AED",
        borderRadius: 20,
        opacity,
        transform: [{ translateY }],
      }}
    >
      <Text style={{ color: "white", fontWeight: "600" }}>{message}</Text>
    </Animated.View>
  );
}
