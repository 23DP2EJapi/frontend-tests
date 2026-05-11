// Database types for the application

export interface Listing {
  id: string;
  title: string;
  description: string;
  user_id: string | null;
  location: string;
  category: string;
  time_commitment: string | null;
  spots: number | null;
  requirements: string | null;
  benefits: string | null;
  is_urgent: boolean | null;
  is_new: boolean | null;
  is_online: boolean | null;
  is_active: boolean | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  listing_id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  motivation: string;
  cv_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  listing_id: string | null;
  user_id: string;
  rating: number;
  comment: string | null;
  review_type: string;
  reviewed_user_id: string | null;
  created_at: string;
}

export interface ReviewWithProfile extends Review {
  profiles: Profile | null;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

// For card display
export interface ListingCardData {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  timeCommitment: string;
  spots: number;
  isUrgent?: boolean;
  isNew?: boolean;
  isOnline?: boolean;
}
