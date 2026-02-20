import { View, FlatList, Text } from "react-native";
import { useCart } from "../providers/CartContext";
import { useTheme } from "../providers/ThemeContext";
import CartSummaryCard from "../components/CartSummaryCard";
import CartItem from "../components/CartItem";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CartScreen() {
  const { items } = useCart();
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.background,
        paddingHorizontal: 12,
        paddingTop: 64,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Ionicons
          name="chevron-back"
          size={28}
          color={theme.text}
          onPress={() => router.push("./")}
        />
        <Text
          style={{
            fontSize: 32,
            fontWeight: "700",
            color: theme.text,
            marginLeft: 12,
          }}
        >
          Cart
        </Text>
      </View>

      {items.length === 0 ? (
        <View
          style={{
            display: "flex",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 0,
            marginBottom: 130,
          }}
        >
          <Ionicons
            name="cart-outline"
            size={80}
            color="#9CA3AF"
            style={{ marginBottom: 8 }}
          />
          <Text
            style={{
              fontSize: 18,
              color: "#6B7280",
              textAlign: "center",
            }}
          >
            The cart is empty
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CartItem item={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}

      <CartSummaryCard />
    </View>
  );
}
