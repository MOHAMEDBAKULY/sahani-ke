export const SESSION_COOKIE = "sahani_session";
export const SESSION_VALUE = `maryam.${process.env.AUTH_SECRET || "sahani-ke-mvp-dev-secret"}`;

export function isValidSession(token: string | undefined) {
  return Boolean(token) && token === SESSION_VALUE;
}
