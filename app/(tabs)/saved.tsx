import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import {
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../providers/ThemeContext";

import JobCard from "../components/JobCard/JobCard";
import SearchBar from "../components/SearchBar/SearchBar";
import { useJobs } from "../providers/JobsContext";
import { useSavedJobs } from "../providers/SavedContext";

export default function SavedScreen() {
  const { theme, dark, setDark } = useTheme();
  const { jobs, loading } = useJobs();
  const { savedJobUUIDs } = useSavedJobs();
  const [query, setQuery] = useState("");

  const filteredJobs = jobs
    .filter((job) => savedJobUUIDs.includes(job.uuid))
    .filter((job) => job.title.toLowerCase().includes(query.toLowerCase()));

  const toggleTheme = () => setDark(!dark);

  return (
    <SafeAreaView
      style={{ backgroundColor: theme.background, flex: 1 }}
      edges={["top"]}
    >
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
      />

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginTop: 12,
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "700", color: theme.text }}>
          Saved
        </Text>

        <TouchableOpacity
          onPress={toggleTheme}
          style={{
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
      </View>

      <SearchBar value={query} onChange={setQuery} />

      {loading ? (
        <Text style={{ padding: 16, color: theme.text }}>Loading jobs...</Text>
      ) : filteredJobs.length === 0 ? (
        <Text style={{ padding: 16, color: theme.text }}>
          No saved jobs found.
        </Text>
      ) : (
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => item.uuid}
          renderItem={({ item }) => <JobCard job={item} override={"Unsave"} />}
          contentContainerStyle={{
            paddingHorizontal: 10,
            paddingBottom: 30,
          }}
          style={{ marginBottom: -35 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
