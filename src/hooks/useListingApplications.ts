import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Application } from "@/types/database";

export const useListingApplications = (listingId: string) => {
  return useQuery({
    queryKey: ["listing-applications", listingId],
    queryFn: async () => {
      const data = await api.get(`/applications?listing_id=${listingId}&sort=-created_at`);
      return data as Application[];
    },
    enabled: !!listingId,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationId,
      status,
    }: {
      applicationId: string;
      status: string;
    }) => {
      await api.patch(`/applications/${applicationId}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["listing-applications"] });
    },
  });
};

export const useMarkListingCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: string) => {
      await api.patch(`/listings/${listingId}`, { is_completed: true, is_active: false });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-listings"] });
    },
  });
};

export const useMyListings = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["my-listings", userId],
    queryFn: async () => {
      const data = await api.get(`/listings?user_id=${userId}&sort=-created_at`);
      return data;
    },
    enabled: !!userId,
  });
};
