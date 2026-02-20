import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import products from "../../assets/store.json";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";
import { useTheme } from "../providers/ThemeContext";
import { useCart } from "../providers/CartContext";

export default function HomeScreen() {
  const { theme, dark, setDark } = useTheme();
  const { items } = useCart();
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()),
  );

  const cartQuantity = items.length;

  const toggleTheme = () => setDark(!dark);

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background, paddingBottom: 0 }}
    >
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 12,
          marginTop: 12,
          marginBottom: 8,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "700", color: theme.text }}>
          Home
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* Theme Toggle */}
          <TouchableOpacity
            onPress={toggleTheme}
            style={{
              marginRight: 12,
              padding: 8,
              borderRadius: 12,
              backgroundColor: dark ? "#303030" : "#E5E7EB",
            }}
          >
            {dark ? (
              <Feather name="sun" size={20} color="#e7e7e7" />
            ) : (
              <Feather name="moon" size={20} color="#1F2937" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/cart")}
            style={{ padding: 8 }}
          >
            <View>
              <Ionicons name="cart-outline" size={28} color={theme.text} />

              {cartQuantity > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    minWidth: 18,
                    height: 18,
                    borderRadius: 9,
                    paddingHorizontal: cartQuantity < 10 ? 0 : 6,
                    backgroundColor: "#7C3AED",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}
                  >
                    {cartQuantity}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <SearchBar value={query} onChange={setQuery} />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductCard item={item} />}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 12,
        }}
        contentContainerStyle={{ paddingBottom: 0 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
