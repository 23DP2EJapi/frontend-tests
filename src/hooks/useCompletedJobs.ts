import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCompletedJobsCount = (userId: string) => {
  return useQuery({
    queryKey: ["completed-jobs", userId],
    queryFn: async () => {
      const data = await api.get(`/applications/completed-count?user_id=${userId}`);
      return data?.count ?? 0;
    },
    enabled: !!userId,
  });
};
