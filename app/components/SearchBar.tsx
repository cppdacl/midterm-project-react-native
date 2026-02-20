import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../providers/ThemeContext";

export default function SearchBar({ value, onChange }: any) {
  const { theme, dark, setDark } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.inputBackground,
        borderRadius: 12,
        paddingHorizontal: 12,
        margin: 9,
        borderColor: "white",
        paddingVertical: 11,
        marginTop: -5,
        borderWidth: 0,
      }}
    >
      <Ionicons name="search" size={18} color="#9CA3AF" />

      <TextInput
        placeholder="Products, Clothes, Accessories, and More"
        placeholderTextColor="#868b94"
        value={value}
        onChangeText={onChange}
        style={{ flex: 1, marginLeft: 8, color: theme.text, fontSize: 16 }}
      />

      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange("")} style={{ padding: 0 }}>
          <Ionicons name="close-circle" size={18} padding={0} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
