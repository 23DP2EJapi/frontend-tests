import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useProfile = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const data = await api.get(`/profiles?user_id=${userId}`);
      return data;
    },
    enabled: !!userId,
  });
};

export const useUpdateProfileName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, fullName }: { userId: string; fullName: string }) => {
      try {
        const profile = await api.get(`/profiles?user_id=${userId}`);

        if (profile?.last_name_change) {
          const lastChange = new Date(profile.last_name_change);
          const twoWeeksAgo = new Date();
          twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
          
          if (lastChange > twoWeeksAgo) {
            const nextAllowed = new Date(lastChange);
            nextAllowed.setDate(nextAllowed.getDate() + 14);
            const daysLeft = Math.ceil((nextAllowed.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            throw new Error(`Vārdu var mainīt tikai reizi 2 nedēļās. Nākamā maiņa iespējama pēc ${daysLeft} dienām.`);
          }
        }

        const data = await api.patch(`/profiles/${userId}`, { 
          full_name: fullName, 
          last_name_change: new Date().toISOString() 
        });

        return data;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile", variables.userId] });
    },
  });
};
