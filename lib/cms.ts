import fs from "fs";
import path from "path";
import { seedStore } from "@/data/seed";
import type {
  CmsStore,
  ContentStatus,
  HydratedDestination,
  HydratedGuide,
  HydratedStory,
  HydratedTrip,
  Locale,
  Story,
  StoryCategory,
} from "./types";

const STORE_PATH = path.join(process.cwd(), "data", ".store.json");

let memory: CmsStore | null = null;

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isPublished(status: ContentStatus, publishedAt: string) {
  if (status === "published") return true;
  if (status === "scheduled" && new Date(publishedAt).getTime() <= Date.now()) return true;
  return false;
}

export function loadStore(): CmsStore {
  if (memory) return memory;
  try {
    if (fs.existsSync(STORE_PATH)) {
      memory = JSON.parse(fs.readFileSync(STORE_PATH, "utf8")) as CmsStore;
      return memory;
    }
  } catch {
    /* fall through to seed */
  }
  memory = clone(seedStore);
  return memory;
}

export function saveStore(next: CmsStore) {
  memory = next;
  try {
    fs.mkdirSync(path.dirname(STORE_PATH), { recursive: true });
    fs.writeFileSync(STORE_PATH, JSON.stringify(next, null, 2), "utf8");
  } catch {
    /* read-only environments keep memory only */
  }
}

export function resetStore() {
  memory = clone(seedStore);
  saveStore(memory);
}

function hydrateDestination(store: CmsStore, destinationId: string): HydratedDestination | null {
  const destination = store.destinations.find((d) => d._id === destinationId);
  if (!destination) return null;
  const country = store.countries.find((c) => c._id === destination.countryId);
  if (!country) return null;
  return { ...destination, country };
}

export function getPublishedStories(store = loadStore()): HydratedStory[] {
  return store.stories
    .filter((s) => isPublished(s.status, s.publishedAt))
    .map((s) => hydrateStory(store, s))
    .filter((s): s is HydratedStory => Boolean(s))
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
}

export function hydrateStory(store: CmsStore, story: Story): HydratedStory | null {
  const destination = hydrateDestination(store, story.destinationId);
  if (!destination) return null;
  const trip = story.tripId ? store.trips.find((t) => t._id === story.tripId) : undefined;
  return { ...story, destination, trip };
}

export function getStoryBySlug(slug: string, includeUnpublished = false, store = loadStore()) {
  const story = store.stories.find((s) => s.slug === slug);
  if (!story) return null;
  if (!includeUnpublished && !isPublished(story.status, story.publishedAt)) return null;
  return hydrateStory(store, story);
}

export function getDestinations(store = loadStore()): HydratedDestination[] {
  return store.destinations
    .map((d) => hydrateDestination(store, d._id))
    .filter((d): d is HydratedDestination => Boolean(d));
}

export function getDestinationBySlug(slug: string, store = loadStore()) {
  const destination = store.destinations.find((d) => d.slug === slug);
  if (!destination) return null;
  return hydrateDestination(store, destination._id);
}

export function getPublishedTrips(store = loadStore()): HydratedTrip[] {
  return store.trips.filter((t) => t.status === "published").map((t) => hydrateTrip(store, t));
}

export function hydrateTrip(store: CmsStore, trip: CmsStore["trips"][number]): HydratedTrip {
  const stories = trip.storyIds
    .map((id) => store.stories.find((s) => s._id === id))
    .filter((s): s is Story => Boolean(s))
    .map((s) => hydrateStory(store, s))
    .filter((s): s is HydratedStory => Boolean(s));
  const route = trip.route
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((point) => {
      const destination = hydrateDestination(store, point.destinationId);
      return destination ? { ...point, destination } : null;
    })
    .filter((p): p is HydratedTrip["route"][number] => Boolean(p));
  return { ...trip, stories, route };
}

export function getTripBySlug(slug: string, store = loadStore()) {
  const trip = store.trips.find((t) => t.slug === slug);
  if (!trip) return null;
  return hydrateTrip(store, trip);
}

export function getPublishedGuides(store = loadStore()): HydratedGuide[] {
  return store.guides
    .filter((g) => isPublished(g.status, g.publishedAt))
    .map((g) => {
      const destination = hydrateDestination(store, g.destinationId);
      return destination ? { ...g, destination } : null;
    })
    .filter((g): g is HydratedGuide => Boolean(g));
}

export function getGuideBySlug(slug: string, store = loadStore()) {
  const guide = store.guides.find((g) => g.slug === slug);
  if (!guide) return null;
  const destination = hydrateDestination(store, guide.destinationId);
  if (!destination) return null;
  return { ...guide, destination };
}

export function storiesForDestination(destinationId: string, store = loadStore()) {
  return getPublishedStories(store).filter((s) => s.destinationId === destinationId);
}

export function searchContent(query: string, locale: Locale, store = loadStore()) {
  const q = query.trim().toLowerCase();
  if (!q) return { stories: [], destinations: [], trips: [], guides: [] };

  const stories = getPublishedStories(store).filter((s) =>
    `${s.title[locale]} ${s.excerpt[locale]} ${s.destination.name[locale]} ${s.category}`
      .toLowerCase()
      .includes(q),
  );
  const destinations = getDestinations(store).filter((d) =>
    `${d.name[locale]} ${d.description[locale]} ${d.country.name[locale]} ${d.region}`
      .toLowerCase()
      .includes(q),
  );
  const trips = getPublishedTrips(store).filter((t) =>
    `${t.title[locale]} ${t.description[locale]}`.toLowerCase().includes(q),
  );
  const guides = getPublishedGuides(store).filter((g) =>
    `${g.title[locale]} ${g.excerpt[locale]}`.toLowerCase().includes(q),
  );
  return { stories, destinations, trips, guides };
}

export function getMapData(filters?: {
  country?: string;
  category?: StoryCategory | "";
  type?: string;
}) {
  const store = loadStore();
  let destinations = getDestinations(store).filter(
    (d) => Number.isFinite(d.coordinates.latitude) && Number.isFinite(d.coordinates.longitude),
  );
  if (filters?.country) {
    destinations = destinations.filter((d) => d.country.slug === filters.country);
  }

  const published = getPublishedStories(store);
  if (filters?.category) {
    const ids = new Set(
      published.filter((s) => s.category === filters.category).map((s) => s.destinationId),
    );
    destinations = destinations.filter((d) => ids.has(d._id));
  }

  const features = destinations.map((d) => ({
    type: "Feature" as const,
    geometry: {
      type: "Point" as const,
      coordinates: [d.coordinates.longitude, d.coordinates.latitude] as [number, number],
    },
    properties: {
      id: d._id,
      slug: d.slug,
      kind: "destination" as const,
      name: d.name,
      countryName: d.country.name,
      coverImage: d.coverImage,
      storyCount: published.filter((s) => s.destinationId === d._id).length,
    },
  }));

  const routes = getPublishedTrips(store).map((trip) => ({
    type: "Feature" as const,
    geometry: {
      type: "LineString" as const,
      coordinates: trip.route.map((p) => [p.longitude, p.latitude] as [number, number]),
    },
    properties: {
      id: trip._id,
      slug: trip.slug,
      kind: "route" as const,
      name: trip.title,
      tripId: trip._id,
    },
  }));

  return {
    type: "FeatureCollection" as const,
    features: [...features, ...routes],
  };
}

export function analytics(store = loadStore()) {
  const stories = store.stories;
  return {
    stories: {
      draft: stories.filter((s) => s.status === "draft").length,
      scheduled: stories.filter((s) => s.status === "scheduled").length,
      published: stories.filter((s) => s.status === "published").length,
      archived: stories.filter((s) => s.status === "archived").length,
    },
    trips: store.trips.length,
    destinations: store.destinations.length,
    guides: store.guides.length,
    media: store.media.length,
    subscribers: store.subscribers.length,
  };
}
