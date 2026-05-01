export type SwipeAction = "pass" | "match" | "super";

export type Profile = {
  id: string;
  name: string;
  age?: number;
  headline: string;
  bio: string;
  location: string;
  distanceKm: number;
  hourlyRate?: number;
  currency?: "ARS" | "USD";
  rating: number;
  reviews: number;
  jobsCompleted?: number;
  skills: string[];
  categories: string[];
  photoUrl: string;
  verified?: boolean;
  online?: boolean;
};
