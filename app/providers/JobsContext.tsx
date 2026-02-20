import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import uuid from "react-native-uuid";

export interface Job {
  uuid: string;

  title: string;
  mainCategory: string;
  companyName: string;
  companyLogo: string;
  jobType: string;
  workModel: string;
  seniorityLevel: string;

  minSalary: number | null;
  maxSalary: number | null;
  currency: string;

  locations: string[];
  tags: string[];

  description: string;
  pubDate: number;
  expiryDate: number;

  applicationLink: string;
  guid: string;
}

interface JobsApiResponse {
  total_count: number;
  jobs: Omit<Job, "uuid">[];
}

interface JobsContextType {
  jobs: Job[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  reloadJobs: () => Promise<void>;
}

const JobsContext = createContext<JobsContextType | undefined>(undefined);

export const JobsProvider = ({ children }: { children: ReactNode }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = "https://empllo.com/api/v1";

  const loadJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data: JobsApiResponse = await response.json();

      const processedJobs: Job[] = (data.jobs || []).map((job) => ({
        ...job,
        uuid: uuid.v4().toString(),
      }));

      setJobs(processedJobs);
      setTotalCount(data.total_count || 0);

      console.log(`Found ${processedJobs.length} Jobs!`);
    } catch (err: any) {
      setError(err?.message ?? "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return (
    <JobsContext.Provider
      value={{
        jobs,
        totalCount,
        loading,
        error,
        reloadJobs: loadJobs,
      }}
    >
      {children}
    </JobsContext.Provider>
  );
};

export const useJobs = (): JobsContextType => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobsProvider");
  }
  return context;
};
