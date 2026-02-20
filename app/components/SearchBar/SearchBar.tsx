import { Ionicons } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../providers/ThemeContext";
import { createStyles } from "./styles";
import { SearchBarProps } from "./types";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search jobs...",
}: SearchBarProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#9CA3AF" />

      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#868b94"
        value={value}
        onChangeText={onChange}
        style={[styles.input, { color: theme.text }]}
      />

      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChange("")}
          style={styles.clearButton}
        >
          <Ionicons name="close-circle" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      )}
    </View>
  );
}
