import React, { useState, useEffect } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../providers/ThemeContext";
import { useSavedJobs } from "../../providers/SavedContext";
import { useJobs } from "../../providers/JobsContext";
import { styles } from "./styles";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { useJobView } from "@/app/providers/JobViewContext";

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

type JobModalProps = {
  jobUuid: string;
};

export default function ApplyModal({ jobUuid }: JobModalProps) {
  const { theme, dark } = useTheme();
  const { jobs } = useJobs();
  const { closeJob, closeApply } = useJobView();
  const { isJobSaved } = useSavedJobs();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [whyHire, setWhyHire] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const translateX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    if (jobUuid) {
      translateX.value = withTiming(0, { duration: 300 });
    }
  }, [jobUuid]);

  if (!jobUuid) return null;

  const job = jobs.find((j) => j.uuid === jobUuid);
  if (!job) return null;

  const saved = isJobSaved(job.uuid);

  const handleClose = () => {
    translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
      runOnJS(closeApply)();
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = Math.max(0, e.translationX);
    })
    .onEnd((e) => {
      if (translateX.value === 0) return;
      const threshold = SCREEN_WIDTH * 0.35;
      if (e.translationX > threshold) {
        translateX.value = withTiming(SCREEN_WIDTH, { duration: 200 }, () => {
          runOnJS(closeApply)();
        });
      } else {
        translateX.value = withTiming(0, { duration: 200 });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateContact = (contact: string) => {
    const re = /^[0-9+\-() ]+$/;
    return re.test(contact);
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter a valid name!");
      return;
    }
    if (!email.trim() || !validateEmail(email)) {
      alert("Please enter a valid email address!");
      return;
    }
    if (!contact.trim() || !validateContact(contact)) {
      alert("Please enter a valid contact number!");
      return;
    }
    if (!whyHire.trim() || whyHire.trim().length < 10) {
      alert("Kindly state your reason for applying!");
      return;
    }

    setSubmitted(true);
    setName("");
    setEmail("");
    setContact("");
    setWhyHire("");
  };

  const handleOkay = () => {
    closeJob();
    handleClose();
  };

  const salary =
    job.minSalary && job.maxSalary
      ? job.minSalary === job.maxSalary
        ? `${job.currency} ${job.minSalary}`
        : `${job.currency} ${job.minSalary} - ${job.currency} ${job.maxSalary}`
      : "* Salary Not Disclosed";

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View
        style={[
          styles.modalContainer,
          {
            backgroundColor: dark ? "#110f1b" : "#fff",
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT,
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
          <Text style={[styles.backText, { color: theme.text }]}>Apply</Text>
        </TouchableOpacity>

        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {!submitted ? (
            <>
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
                </View>
              </View>

              <View style={{ marginTop: 25 }}>
                <Text style={{ color: theme.text, marginBottom: 6 }}>Name</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: dark ? "#212033" : "#ccc",
                      color: dark ? "#fff" : "#111",
                    },
                  ]}
                  placeholder="Enter your name"
                  placeholderTextColor={theme.placeholder}
                  value={name}
                  onChangeText={setName}
                />

                <Text style={{ color: theme.text, marginBottom: 6 }}>
                  Email
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: dark ? "#212033" : "#ccc",
                      color: dark ? "#fff" : "#111",
                    },
                  ]}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.placeholder}
                  value={email}
                  onChangeText={setEmail}
                />

                <Text style={{ color: theme.text, marginBottom: 6 }}>
                  Contact Number
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: dark ? "#212033" : "#ccc",
                      color: dark ? "#fff" : "#111",
                    },
                  ]}
                  placeholder="Enter your contact number"
                  placeholderTextColor={theme.placeholder}
                  value={contact}
                  onChangeText={setContact}
                />

                <Text style={{ color: theme.text, marginBottom: 6 }}>
                  Why should we hire you?
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    {
                      height: 120,
                      borderColor: dark ? "#212033" : "#ccc",
                      color: dark ? "#fff" : "#111",
                    },
                  ]}
                  multiline
                  placeholder="Tell us why you are a good fit..."
                  placeholderTextColor={theme.placeholder}
                  value={whyHire}
                  onChangeText={setWhyHire}
                />
              </View>
            </>
          ) : (
            <View style={{ marginTop: 220, alignItems: "center" }}>
              <Ionicons
                name="checkmark-circle"
                size={70}
                color={theme.primary}
                style={{ marginBottom: 20 }}
              />

              <Text
                style={{
                  color: theme.text,
                  fontSize: 20,
                  fontWeight: "700",
                  marginBottom: 10,
                }}
              >
                Application Sent
              </Text>

              <Text
                style={{
                  color: theme.placeholder,
                  textAlign: "center",
                  marginBottom: 30,
                }}
              >
                Your application has been submitted successfully.
              </Text>

              <TouchableOpacity
                style={[styles.applyButton, { width: "60%" }]}
                onPress={handleOkay}
              >
                <Text style={styles.applyText}>Okay</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
        {!submitted && (
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
              style={[styles.saveButton, { backgroundColor: "#6d6b74" }]}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.applyButton,
                { flex: 1, marginLeft: 10, backgroundColor: theme.primary },
              ]}
              onPress={handleSubmit}
            >
              <Text style={styles.applyText}>Submit</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
