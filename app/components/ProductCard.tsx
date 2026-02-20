import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../providers/CartContext";
import { useTheme } from "../providers/ThemeContext";
import { useToast } from "../providers/ToastContext";

export default function ProductCard({ item }: any) {
  const { addToCart } = useCart();
  const { theme } = useTheme();
  const { showToast } = useToast();

  return (
    <View
      style={{
        width: "48%",
        backgroundColor: theme.card,
        borderRadius: 12,
        padding: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Image
        source={{ uri: item.image }}
        resizeMode="contain"
        style={{
          width: "100%",
          aspectRatio: 1,
          borderRadius: 8,
          backgroundColor: "#E5E7EB",
        }}
      />

      <TouchableOpacity
        onPress={() => {
          addToCart(item);
          showToast("Added to Cart!");
        }}
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "#FFFFFF",
          borderRadius: 999,
        }}
      >
        <Ionicons name="add-circle" size={30} color="#7C3AED" />
      </TouchableOpacity>

      <Text
        numberOfLines={2}
        style={{
          marginTop: 8,
          fontSize: 14,
          fontWeight: "600",
          color: theme.text,
        }}
      >
        {item.name}
      </Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 6,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: theme.text,
            marginTop: -5,
          }}
        >
          ₱ {item.price.toLocaleString()}
        </Text>

        <Text
          style={{
            fontSize: 11,
            color: "#6B7280",
            marginTop: -5,
          }}
        >
          {item.sold} Sold
        </Text>
      </View>

      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
      >
        <Ionicons
          name="boat-outline"
          size={14}
          color="#6B7280"
          style={{ marginRight: 4, marginLeft: -1 }}
        />
        <Text style={{ fontSize: 9, color: "#6B7280" }}>
          {item.shipping.minShippingDay}–{item.shipping.maxShippingDay} Days |{" "}
          {item.shipping.location}
        </Text>
      </View>
    </View>
  );
}
