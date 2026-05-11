import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

export const useIsAdmin = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;

      try {
        const data = await api.get(`/user-roles?user_id=${user.id}&role=admin`);
        return data?.has_role === true;
      } catch (error) {
        console.error("Error checking admin role:", error);
        return false;
      }
    },
    enabled: !!user?.id,
  });
};

export const useAllListings = (enabled: boolean) => {
  return useQuery({
    queryKey: ["admin-listings"],
    queryFn: async () => {
      const data = await api.get("/listings?sort=-created_at");
      return data;
    },
    enabled,
  });
};

export const useAllReviews = (enabled: boolean) => {
  return useQuery({
    queryKey: ["admin-reviews"],
    queryFn: async () => {
      const data = await api.get("/reviews?include=profile&sort=-created_at");
      return data;
    },
    enabled,
  });
};

export const useAllProfiles = (enabled: boolean) => {
  return useQuery({
    queryKey: ["admin-profiles"],
    queryFn: async () => {
      const data = await api.get("/profiles?sort=-created_at");
      return data;
    },
    enabled,
  });
};

export const useAllApplications = (enabled: boolean) => {
  return useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => {
      const data = await api.get("/applications?include=listing&sort=-created_at");
      return data;
    },
    enabled,
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reviewId: string) => {
      await api.delete(`/reviews/${reviewId}`);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }); },
  });
};

export const useDeleteListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (listingId: string) => {
      await api.delete(`/listings/${listingId}`);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-listings"] }); },
  });
};

export const useUpdateListing = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      await api.patch(`/listings/${id}`, updates);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-listings"] }); },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      await api.patch(`/profiles/${id}`, updates);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-profiles"] }); },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (profileId: string) => {
      await api.delete(`/profiles/${profileId}`);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-profiles"] }); },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string; [key: string]: any }) => {
      await api.patch(`/reviews/${id}`, updates);
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-reviews"] }); },
  });
};
