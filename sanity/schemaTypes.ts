export const country = {
  name: "country",
  title: "Country",
  type: "document",
  fields: [
    { name: "name", type: "object", fields: [{ name: "en", type: "string" }, { name: "ar", type: "string" }] },
    { name: "slug", type: "slug", options: { source: "name.en" } },
    { name: "code", type: "string" },
    { name: "description", type: "object", fields: [{ name: "en", type: "text" }, { name: "ar", type: "text" }] },
    { name: "heroImage", type: "image" },
    { name: "coordinates", type: "object", fields: [{ name: "latitude", type: "number" }, { name: "longitude", type: "number" }] },
  ],
};

export const destination = {
  name: "destination",
  title: "Destination",
  type: "document",
  fields: [
    { name: "name", type: "object", fields: [{ name: "en", type: "string" }, { name: "ar", type: "string" }] },
    { name: "slug", type: "slug", options: { source: "name.en" } },
    { name: "country", type: "reference", to: [{ type: "country" }] },
    { name: "region", type: "string" },
    { name: "description", type: "object", fields: [{ name: "en", type: "text" }, { name: "ar", type: "text" }] },
    { name: "coordinates", type: "object", fields: [{ name: "latitude", type: "number" }, { name: "longitude", type: "number" }] },
    { name: "coverImage", type: "image" },
    { name: "gallery", type: "array", of: [{ type: "image" }] },
  ],
};

export const story = {
  name: "story",
  title: "Story",
  type: "document",
  fields: [
    { name: "title", type: "object", fields: [{ name: "en", type: "string" }, { name: "ar", type: "string" }] },
    { name: "slug", type: "slug", options: { source: "title.en" } },
    { name: "excerpt", type: "object", fields: [{ name: "en", type: "text" }, { name: "ar", type: "text" }] },
    { name: "content", type: "object", fields: [{ name: "en", type: "array", of: [{ type: "block" }] }, { name: "ar", type: "array", of: [{ type: "block" }] }] },
    { name: "destination", type: "reference", to: [{ type: "destination" }] },
    { name: "trip", type: "reference", to: [{ type: "trip" }] },
    {
      name: "category",
      type: "string",
      options: {
        list: ["Luxury Safari", "Coastal Retreat", "Cultural Discovery", "Urban Editorial", "Culinary Journey"],
      },
    },
    { name: "status", type: "string", options: { list: ["draft", "scheduled", "published", "archived"] } },
    { name: "publishedAt", type: "datetime" },
    { name: "scheduledAt", type: "datetime" },
    { name: "audioUrl", type: "url" },
    { name: "videoEmbedUrl", type: "url" },
  ],
};

export const trip = {
  name: "trip",
  title: "Trip",
  type: "document",
  fields: [
    { name: "title", type: "object", fields: [{ name: "en", type: "string" }, { name: "ar", type: "string" }] },
    { name: "slug", type: "slug", options: { source: "title.en" } },
    { name: "description", type: "object", fields: [{ name: "en", type: "text" }, { name: "ar", type: "text" }] },
    { name: "coverImage", type: "image" },
    { name: "startDate", type: "date" },
    { name: "endDate", type: "date" },
    {
      name: "route",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "destination", type: "reference", to: [{ type: "destination" }] },
            { name: "order", type: "number" },
            { name: "latitude", type: "number" },
            { name: "longitude", type: "number" },
          ],
        },
      ],
    },
    { name: "stories", type: "array", of: [{ type: "reference", to: [{ type: "story" }] }] },
    { name: "status", type: "string" },
  ],
};

export const guide = {
  name: "guide",
  title: "Guide",
  type: "document",
  fields: [
    { name: "title", type: "object", fields: [{ name: "en", type: "string" }, { name: "ar", type: "string" }] },
    { name: "slug", type: "slug" },
    { name: "destination", type: "reference", to: [{ type: "destination" }] },
    { name: "content", type: "object", fields: [{ name: "en", type: "array", of: [{ type: "block" }] }, { name: "ar", type: "array", of: [{ type: "block" }] }] },
    { name: "status", type: "string" },
  ],
};

export const schemaTypes = [country, destination, story, trip, guide];
