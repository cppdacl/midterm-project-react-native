import { Ionicons } from "@expo/vector-icons";
import { Linking, Text, TouchableOpacity, View, Image } from "react-native";
import { useTheme } from "../../providers/ThemeContext";
import { Job } from "../../providers/JobsContext";
import { useSavedJobs } from "../../providers/SavedContext";
import { useJobView } from "../../providers/JobViewContext"; // for opening modal
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
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const { openJob } = useJobView();

  const saved = isJobSaved(job.uuid);

  const salary =
    job.minSalary && job.maxSalary
      ? job.minSalary === job.maxSalary
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: job.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(job.minSalary)
        : `${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: job.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(job.minSalary)} - ${new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: job.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(job.maxSalary)}`
      : "* Salary Not Disclosed";

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => openJob(job.uuid)} // open modal on card press
      style={[styles.card, { backgroundColor: dark ? "#1B1826" : "#F3F4F6" }]}
    >
      {/* Top Row */}
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

      {/* Details */}
      <View style={styles.details}>
        <Text style={[styles.meta, { color: theme.text }]}>
          {toTitleCase(job.workModel)} • {toTitleCase(job.jobType)} •{" "}
          {toTitleCase(job.seniorityLevel)}
        </Text>

        {job.locations?.length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="location-outline"
              size={14}
              color={theme.placeholder}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.meta, { color: theme.placeholder }]}>
              {job.locations[0]}
            </Text>
          </View>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        {/* Save Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.saveButton,
            { backgroundColor: saved ? theme.primary : "#6d6b74" },
          ]}
          onPress={(e) => {
            e.stopPropagation(); // prevents triggering card onPress
            saved ? removeJob(job.uuid) : saveJob(job.uuid);
          }}
        >
          <Text style={styles.buttonText}>{saved ? "Saved" : "Save Job"}</Text>
        </TouchableOpacity>

        {/* Apply Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.applyButton}
          onPress={(e) => {
            e.stopPropagation(); // prevents triggering card onPress
            Linking.openURL(job.applicationLink);
          }}
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
