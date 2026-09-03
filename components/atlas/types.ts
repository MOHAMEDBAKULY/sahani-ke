import type { StoryCategory } from "@/lib/types";

export type MapPoint = {
  id: string;
  slug: string;
  name: { en: string; ar: string };
  countryName: { en: string; ar: string };
  countrySlug: string;
  coverImage: string;
  storyCount: number;
  latitude: number;
  longitude: number;
  categories: StoryCategory[];
};

export type MapRoute = {
  id: string;
  slug: string;
  title: { en: string; ar: string };
  points: { latitude: number; longitude: number }[];
};
