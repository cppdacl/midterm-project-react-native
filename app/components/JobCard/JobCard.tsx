import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { Job } from "../../providers/JobsContext";
import { useTheme } from "../../providers/ThemeContext";
import { styles } from "./styles";

type Props = {
  job: Job;
};

const toTitleCase = (text?: string) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function JobCard({ job }: Props) {
  const { theme, dark } = useTheme();
  const router = useRouter();

  const salary =
    job.minSalary && job.maxSalary
      ? job.minSalary === job.maxSalary
        ? `${job.currency} ${job.minSalary.toLocaleString()}`
        : `${job.currency} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`
      : "* Salary Not Disclosed";

  return (
    <View
      style={[styles.card, { backgroundColor: dark ? "#1B1826" : "#F3F4F6" }]}
    >
      <View style={styles.topRow}>
        <Image
          source={{ uri: job.companyLogo }}
          style={styles.logo}
          resizeMode="cover"
        />

        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.text }]}>{job.title}</Text>

          <Text style={[styles.company, { color: theme.placeholder }]}>
            {job.companyName}
          </Text>

          <Text style={[styles.salary, { color: theme.primary }]}>
            {salary}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <Text style={[styles.meta, { color: theme.text }]}>
          {toTitleCase(job.workModel)} • {toTitleCase(job.jobType)} •{" "}
          {toTitleCase(job.seniorityLevel)}
        </Text>

        {job.locations?.length > 0 && (
          <View style={styles.locationRow}>
            <Feather
              name="globe"
              size={14}
              color={theme.placeholder}
              style={{ marginRight: 6, marginBottom: 3.5 }}
            />
            <Text style={[styles.meta, { color: theme.placeholder }]}>
              {job.locations[0]}
            </Text>
          </View>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: "#605e66" }]}
        >
          <Text style={styles.buttonText}>{false ? "Saved" : "Save Job"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => Linking.openURL(job.applicationLink)}
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
