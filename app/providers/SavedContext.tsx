import React, { createContext, useContext, useState } from "react";
import { useToast } from "../providers/ToastContext";

type SavedContextType = {
  savedJobUUIDs: string[];
  saveJob: (uuid: string) => void;
  removeJob: (uuid: string) => void;
  isJobSaved: (uuid: string) => boolean;
  clearAll: () => void;
};

const SavedContext = createContext<SavedContextType>(null as any);

export function SavedProvider({ children }: { children: React.ReactNode }) {
  const { showToast } = useToast();
  const [savedJobUUIDs, setSavedJobUUIDs] = useState<string[]>([]);

  const saveJob = (uuid: string) => {
    showToast("Job Saved!");
    setSavedJobUUIDs((prev) => (prev.includes(uuid) ? prev : [...prev, uuid]));
  };

  const removeJob = (uuid: string) => {
    showToast("Job Unsaved!");
    setSavedJobUUIDs((prev) => prev.filter((id) => id !== uuid));
  };

  const isJobSaved = (uuid: string) => savedJobUUIDs.includes(uuid);

  const clearAll = () => setSavedJobUUIDs([]);

  return (
    <SavedContext.Provider
      value={{ savedJobUUIDs, saveJob, removeJob, isJobSaved, clearAll }}
    >
      {children}
    </SavedContext.Provider>
  );
}

export const useSavedJobs = () => useContext(SavedContext);
