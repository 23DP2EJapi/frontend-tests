import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Listing, ListingCardData } from "@/types/database";

// Transform database listing to card data format
export const transformToCardData = (listing: Listing): ListingCardData => ({
  id: listing.id,
  title: listing.title,
  location: listing.location,
  category: listing.category,
  description: listing.description,
  timeCommitment: listing.time_commitment || "Nav norādīts",
  spots: listing.spots || 1,
  isUrgent: listing.is_urgent || false,
  isNew: listing.is_new || false,
  isOnline: listing.is_online || false,
});

export const useListings = (filters?: {
  category?: string;
  city?: string;
  search?: string;
  isOnline?: boolean;
  isUrgent?: boolean;
  timeCommitment?: string;
}) => {
  return useQuery({
    queryKey: ["listings", filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filters?.search) params.set('search', filters.search);
      if (filters?.category && filters.category !== "Visi") params.set('category', filters.category);
      if (filters?.city && filters.city !== "Visas pilsētas") params.set('city', filters.city);
      if (filters?.isOnline) params.set('is_online', 'true');
      if (filters?.isUrgent) params.set('is_urgent', 'true');
      if (filters?.timeCommitment && filters.timeCommitment !== "Visi") params.set('time_commitment', filters.timeCommitment);
      
      const queryString = params.toString() ? `?${params}` : '';
      const data = await api.get(`/listings${queryString}`);
      return (data as Listing[]).map(transformToCardData);
    },
  });
};

export const useFeaturedListings = (limit = 6) => {
  return useQuery({
    queryKey: ["featured-listings", limit],
    queryFn: async () => {
      const data = await api.get(`/listings?limit=${limit}`);
      return (data as Listing[]).map(transformToCardData);
    },
  });
};

export const useListing = (id: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: async () => {
      const data = await api.get(`/listings/${id}`);
      return data as Listing;
    },
    enabled: !!id,
  });
};
