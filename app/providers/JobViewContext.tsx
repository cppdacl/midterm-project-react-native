import React, { createContext, useContext, useState } from "react";
import { Job } from "./JobsContext";
import JobModal from "../components/JobModal/JobModal";

type JobViewContextType = {
  currentJobUuid: string | null;
  openJob: (uuid: string) => void;
  closeJob: () => void;
};

const JobViewContext = createContext<JobViewContextType | null>(null);

export function JobViewProvider({ children }: { children: React.ReactNode }) {
  const [currentJobUuid, setCurrentJobUuid] = useState<string | null>(null);

  const openJob = (uuid: string) => setCurrentJobUuid(uuid);
  const closeJob = () => setCurrentJobUuid(null);

  return (
    <JobViewContext.Provider value={{ currentJobUuid, openJob, closeJob }}>
      {children}
      {currentJobUuid && <JobModal />}
    </JobViewContext.Provider>
  );
}

export const useJobView = () => {
  const ctx = useContext(JobViewContext);
  if (!ctx) throw new Error("useJobView must be used within JobViewProvider");
  return ctx;
};
