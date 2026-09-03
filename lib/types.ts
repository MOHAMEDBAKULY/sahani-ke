export type Locale = "en" | "ar";
export type Currency = "KES" | "USD";
export type Localized<T = string> = { en: T; ar: T };

export type ContentStatus = "draft" | "scheduled" | "published" | "archived";

export type StoryCategory =
  | "Luxury Safari"
  | "Coastal Retreat"
  | "Cultural Discovery"
  | "Urban Editorial"
  | "Culinary Journey";

export type ContentTypeFilter = "stories" | "trips" | "guides" | "destinations";

export interface PortableSpan {
  _type: "span";
  text: string;
  marks?: string[];
}

export interface PortableBlock {
  _type: "block";
  style: "normal" | "h2" | "h3" | "blockquote";
  children: PortableSpan[];
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface PracticalInformation {
  bestTimeToVisit?: Localized;
  recommendedDuration?: string;
  currencyAccepted: Currency[];
  estimatedCosts: {
    accommodationMinUSD?: number;
    accommodationMaxUSD?: number;
    activityAvgKES?: number;
    foodAvgKES?: number;
  };
  transportationNotes?: Localized;
  usefulTips?: Localized<string[]>;
}

export interface Country {
  _id: string;
  name: Localized;
  slug: string;
  code: string;
  description: Localized;
  heroImage: string;
  coordinates: Coordinates;
}

export interface Destination {
  _id: string;
  name: Localized;
  slug: string;
  countryId: string;
  region: string;
  description: Localized;
  coordinates: Coordinates;
  coverImage: string;
  gallery: string[];
  practicalInfo: PracticalInformation;
  seo: {
    metaTitle: Localized;
    metaDescription: Localized;
    shareImage: string;
  };
}

export interface RoutePoint {
  _id: string;
  destinationId: string;
  order: number;
  latitude: number;
  longitude: number;
  arrivalDate?: string;
  departureDate?: string;
  notes?: Localized;
}

export interface Story {
  _id: string;
  title: Localized;
  slug: string;
  excerpt: Localized;
  content: Localized<PortableBlock[]>;
  heroMedia: {
    type: "image" | "video";
    url: string;
    caption?: string;
    credit?: string;
  };
  gallery: string[];
  audioUrl?: string;
  videoEmbedUrl?: string;
  destinationId: string;
  tripId?: string;
  category: StoryCategory;
  readingTimeMinutes: number;
  status: ContentStatus;
  publishedAt: string;
  scheduledAt?: string;
  author: string;
  seo: {
    metaTitle: Localized;
    metaDescription: Localized;
    shareImage: string;
  };
}

export interface Trip {
  _id: string;
  title: Localized;
  slug: string;
  description: Localized;
  coverImage: string;
  startDate: string;
  endDate: string;
  route: RoutePoint[];
  storyIds: string[];
  status: Exclude<ContentStatus, "archived">;
}

export interface Guide {
  _id: string;
  title: Localized;
  slug: string;
  excerpt: Localized;
  content: Localized<PortableBlock[]>;
  destinationId: string;
  coverImage: string;
  publishedAt: string;
  status: ContentStatus;
}

export interface MediaAsset {
  _id: string;
  url: string;
  alt: Localized;
  credit: string;
  kind: "image" | "audio" | "video";
}

export interface Subscriber {
  id: string;
  email: string;
  language: Locale;
  subscribedAt: string;
  status: "pending" | "confirmed";
}

export interface SiteSettings {
  name: string;
  wordmark: string;
  tagline: Localized;
  bio: Localized;
  locationLine: Localized;
  social: {
    instagram: string;
    x: string;
    pinterest: string;
  };
  seo: {
    defaultTitle: Localized;
    defaultDescription: Localized;
  };
}

export interface CmsStore {
  settings: SiteSettings;
  countries: Country[];
  destinations: Destination[];
  stories: Story[];
  trips: Trip[];
  guides: Guide[];
  media: MediaAsset[];
  subscribers: Subscriber[];
}

export interface MapFeatureProperties {
  id: string;
  slug: string;
  kind: "destination" | "route";
  name: Localized;
  countryName?: Localized;
  coverImage?: string;
  storyCount?: number;
  tripId?: string;
}

export type HydratedDestination = Destination & { country: Country };
export type HydratedStory = Omit<Story, "destinationId" | "tripId"> & {
  destinationId: string;
  tripId?: string;
  destination: HydratedDestination;
  trip?: Trip;
};
export type HydratedTrip = Omit<Trip, "route" | "storyIds"> & {
  storyIds: string[];
  stories: HydratedStory[];
  route: Array<RoutePoint & { destination: HydratedDestination }>;
};
export type HydratedGuide = Guide & { destination: HydratedDestination };
