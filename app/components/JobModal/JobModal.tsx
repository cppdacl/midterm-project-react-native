import React, { useEffect } from "react";
import {
  Linking,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../providers/ThemeContext";
import { useSavedJobs } from "../../providers/SavedContext";
import { useJobs } from "../../providers/JobsContext";
import { useJobView } from "../../providers/JobViewContext";
import { styles } from "./styles";
import RenderHtml from "react-native-render-html";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  withSpring,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";

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

  const translateX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    if (currentJobUuid) {
      translateX.value = withTiming(0, { duration: 300 });
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
    translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
      runOnJS(closeJob)();
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = Math.max(0, e.translationX);
    })
    .onEnd((e) => {
      const threshold = SCREEN_WIDTH * 0.6;
      const fastSwipe = e.velocityX > 800;

      if (e.translationX > threshold || fastSwipe) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
          runOnJS(closeJob)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor: dark ? "#110f1b" : "#fff",
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
            position: "absolute",
            top: 0,
            left: 0,
          },
          animatedStyle,
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
                baseStyle={{
                  color: theme.text,
                  fontSize: 14,
                  lineHeight: 20,
                  marginLeft: 5,
                }}
                tagsStyles={{
                  h1: { fontSize: 22, fontWeight: "700", marginVertical: 6 },
                  h2: { fontSize: 20, fontWeight: "700", marginVertical: 6 },
                  h3: { fontSize: 18, fontWeight: "700", marginVertical: 6 },
                  p: { fontSize: 16, marginVertical: 4 },
                  li: { fontSize: 14, marginVertical: 2, marginLeft: 16 },
                  ul: { marginVertical: 10, marginHorizontal: 6 },
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
            <Text style={styles.buttonText}>
              {saved ? "Saved" : "Save Job"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.applyButton, { flex: 1, marginLeft: 10 }]}
            onPress={() => Linking.openURL(job.applicationLink)}
          >
            <Text style={styles.applyText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
