import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Review, ReviewWithProfile } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";

export const useListingReviews = (listingId: string) => {
  return useQuery({
    queryKey: ["reviews", "listing", listingId],
    queryFn: async () => {
      const data = await api.get(`/reviews?listing_id=${listingId}&include=profile&sort=-created_at`);
      return data as unknown as ReviewWithProfile[];
    },
    enabled: !!listingId,
  });
};

export const useVolunteerReviews = (userId: string) => {
  return useQuery({
    queryKey: ["reviews", "volunteer", userId],
    queryFn: async () => {
      const data = await api.get(`/reviews?reviewed_user_id=${userId}&review_type=volunteer&include=profile&sort=-created_at`);
      return data as unknown as ReviewWithProfile[];
    },
    enabled: !!userId,
  });
};

export const useListingStats = (listingId: string) => {
  return useQuery({
    queryKey: ["listing-stats", listingId],
    queryFn: async () => {
      const data = await api.get(`/reviews?listing_id=${listingId}`);

      if (!data || data.length === 0) {
        return { averageRating: 0, reviewCount: 0 };
      }

      const sum = data.reduce((acc: number, review: any) => acc + review.rating, 0);
      return {
        averageRating: Math.round((sum / data.length) * 10) / 10,
        reviewCount: data.length,
      };
    },
    enabled: !!listingId,
  });
};

export const useVolunteerStats = (userId: string) => {
  return useQuery({
    queryKey: ["volunteer-stats", userId],
    queryFn: async () => {
      const data = await api.get(`/reviews?reviewed_user_id=${userId}&review_type=volunteer`);

      if (!data || data.length === 0) {
        return { averageRating: 0, reviewCount: 0 };
      }

      const sum = data.reduce((acc: number, review: any) => acc + review.rating, 0);
      return {
        averageRating: Math.round((sum / data.length) * 10) / 10,
        reviewCount: data.length,
      };
    },
    enabled: !!userId,
  });
};

export const useSubmitReview = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: {
      listing_id: string;
      rating: number;
      comment?: string;
      review_type?: string;
      reviewed_user_id?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const data = await api.post("/reviews", {
        listing_id: params.listing_id,
        user_id: user.id,
        rating: params.rating,
        comment: params.comment || null,
        review_type: params.review_type || "listing",
        reviewed_user_id: params.reviewed_user_id || null,
      });

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["listing-stats", variables.listing_id] });
      if (variables.reviewed_user_id) {
        queryClient.invalidateQueries({ queryKey: ["volunteer-stats", variables.reviewed_user_id] });
      }
    },
  });
};
