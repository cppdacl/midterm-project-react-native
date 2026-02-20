import React, { useEffect, useRef } from "react";
import {
  Animated,
  Linking,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { useTheme } from "../../providers/ThemeContext";
import { useSavedJobs } from "../../providers/SavedContext";
import { useJobs } from "../../providers/JobsContext";
import { useJobView } from "../../providers/JobViewContext";
import { styles } from "./styles";
import { Ionicons } from "@expo/vector-icons";
import RenderHtml from "react-native-render-html";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const toTitleCase = (text?: string) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function JobModal() {
  const { theme, dark } = useTheme();
  const { jobs } = useJobs();
  const { currentJobUuid, closeJob } = useJobView();
  const { saveJob, removeJob, isJobSaved } = useSavedJobs();
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    if (currentJobUuid) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [currentJobUuid]);

  if (!currentJobUuid) return null;

  const job = jobs.find((j) => j.uuid === currentJobUuid);
  if (!job) return null;

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

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => closeJob());
  };

  return (
    <Animated.View
      style={[
        styles.modalContainer,
        {
          backgroundColor: dark ? "#110f1b" : "#fff",
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={handleClose} style={styles.backButton}>
        <Ionicons
          name="chevron-back"
          size={24}
          color={theme.text}
          style={{ marginTop: 50 }}
        />
        <Text style={[styles.backText, { color: theme.text }]}>Details</Text>
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: 120,
          minHeight: SCREEN_HEIGHT - 100,
          justifyContent: "center",
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.jobHeader}>
          <Image source={{ uri: job.companyLogo }} style={styles.logo} />
          <View style={styles.jobInfo}>
            <Text style={[styles.title, { color: theme.text }]}>
              {job.title}
            </Text>
            <Text style={[styles.company, { color: theme.placeholder }]}>
              {job.companyName}
            </Text>
            <Text style={[styles.salary, { color: theme.primary }]}>
              {salary}
            </Text>
            <Text style={[styles.meta, { color: theme.text }]}>
              {toTitleCase(job.workModel)} • {toTitleCase(job.jobType)} •{" "}
              {toTitleCase(job.seniorityLevel)}
            </Text>
            {job.locations?.length > 0 && (
              <View style={styles.locationRow}>
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
        </View>

        {job.description && (
          <View style={{ marginTop: 16 }}>
            <RenderHtml
              contentWidth={SCREEN_WIDTH - 32}
              source={{ html: job.description }}
              baseStyle={{ color: theme.text, fontSize: 14, lineHeight: 20 }}
              tagsStyles={{
                h1: { fontSize: 22, fontWeight: "700", marginVertical: 6 },
                h2: { fontSize: 20, fontWeight: "700", marginVertical: 6 },
                h3: { fontSize: 18, fontWeight: "700", marginVertical: 4 },
                p: { fontSize: 14, marginVertical: 4 },
                li: { fontSize: 14, marginVertical: 2, marginLeft: 16 },
              }}
            />
          </View>
        )}
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: 16,
          backgroundColor: dark ? "#110f1b" : "#fff",
          flexDirection: "row",
          paddingBottom: 25,
          borderWidth: 0.5,
          borderTopColor: dark ? "#222" : "#E5E7EB",
        }}
      >
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: saved ? theme.primary : "#6d6b74" },
          ]}
          onPress={() => (saved ? removeJob(job.uuid) : saveJob(job.uuid))}
        >
          <Text style={styles.buttonText}>{saved ? "Saved" : "Save Job"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.applyButton, { flex: 1, marginLeft: 10 }]}
          onPress={() => Linking.openURL(job.applicationLink)}
        >
          <Text style={styles.applyText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
