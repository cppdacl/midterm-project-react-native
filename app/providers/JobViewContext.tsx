import React, { createContext, useContext, useState } from "react";
import JobModal from "../components/JobModal/JobModal";
import ApplyModal from "../components/ApplyModal/ApplyModal";

type JobViewContextType = {
  currentJobUuid: string | null; // Job modal
  applyJobUuid: string | null; // Apply modal
  openJob: (uuid: string) => void;
  closeJob: () => void;
  openApply: (uuid: string) => void;
  closeApply: () => void;
};

const JobViewContext = createContext<JobViewContextType | null>(null);

export function JobViewProvider({ children }: { children: React.ReactNode }) {
  const [currentJobUuid, setCurrentJobUuid] = useState<string | null>(null);
  const [applyJobUuid, setApplyJobUuid] = useState<string | null>(null);

  const openJob = (uuid: string) => setCurrentJobUuid(uuid);
  const closeJob = () => setCurrentJobUuid(null);

  const openApply = (uuid: string) => setApplyJobUuid(uuid);
  const closeApply = () => setApplyJobUuid(null);

  return (
    <JobViewContext.Provider
      value={{
        currentJobUuid,
        applyJobUuid,
        openJob,
        closeJob,
        openApply,
        closeApply,
      }}
    >
      {children}
      {/* Modals rendered independently to avoid hooks issues */}
      {currentJobUuid && <JobModal jobUuid={currentJobUuid} />}
      {applyJobUuid && <ApplyModal jobUuid={applyJobUuid} />}
    </JobViewContext.Provider>
  );
}

export const useJobView = () => {
  const ctx = useContext(JobViewContext);
  if (!ctx) throw new Error("useJobView must be used within JobViewProvider");
  return ctx;
};
