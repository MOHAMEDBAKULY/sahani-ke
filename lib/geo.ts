export const AFRICA_BOUNDS = {
  minLng: -18,
  maxLng: 52,
  minLat: -35,
  maxLat: 38,
};

export function projectMercator(
  latitude: number,
  longitude: number,
  width: number,
  height: number,
) {
  const { minLng, maxLng, minLat, maxLat } = AFRICA_BOUNDS;
  const x = ((longitude - minLng) / (maxLng - minLng)) * width;
  const y = ((maxLat - latitude) / (maxLat - minLat)) * height;
  return { x, y };
}

export function hasMapboxToken() {
  return Boolean(process.env.NEXT_PUBLIC_MAPBOX_TOKEN);
}
