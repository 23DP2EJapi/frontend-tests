import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

interface ApplicationData {
  listing_id: string;
  phone?: string;
  motivation: string;
  cv_url?: string;
}

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: ApplicationData) => {
      if (!user) {
        throw new Error("Lai pieteiktos, nepieciešams pieslēgties");
      }

      try {
        const profile = await api.get(`/profiles?user_id=${user.id}`);
        
        const applicationData = {
          ...data,
          user_id: user.id,
          full_name: profile?.full_name || user.email?.split("@")[0] || "Lietotājs",
          email: user.email || "",
          status: "pending",
        };

        const result = await api.post("/applications", applicationData);
        return result;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
    },
  });
};

export const useMyApplications = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["my-applications", userId],
    queryFn: async () => {
      const data = await api.get(`/applications?user_id=${userId}&include=listing`);
      return data;
    },
    enabled: !!userId,
  });
};
