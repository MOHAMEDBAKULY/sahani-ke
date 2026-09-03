import { schemaTypes } from "./schemaTypes";

const projectId = process.env.SANITY_PROJECT_ID || "";

export const sanityConfig = {
  projectId,
  dataset: process.env.SANITY_DATASET || "production",
  title: "Sahani.KE CMS",
  schema: { types: schemaTypes },
};

export function sanityEnabled() {
  return Boolean(projectId);
}
