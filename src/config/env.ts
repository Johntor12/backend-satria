const DEFAULT_DEV_JWT_SECRET = "your_jwt_secret_key_change_this";

const normalizeOrigin = (value: string): string => value.trim().replace(/\/+$/, "");

const isPlaceholderJwtSecret = (value: string): boolean =>
  value === DEFAULT_DEV_JWT_SECRET || value === "satria-backend";

const isProduction = process.env.NODE_ENV === "production";

export const getJwtSecret = (): string => {
  const rawSecret = process.env.JWT_SECRET?.trim();

  if (!rawSecret) {
    if (isProduction) {
      throw new Error("JWT_SECRET must be set in production");
    }

    return DEFAULT_DEV_JWT_SECRET;
  }

  if (isProduction && isPlaceholderJwtSecret(rawSecret)) {
    throw new Error("JWT_SECRET must not use the placeholder/default value in production");
  }

  return rawSecret;
};

export const getAllowedOrigins = (): string[] =>
  (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map(normalizeOrigin);

export const isOriginAllowed = (origin: string): boolean => {
  const normalizedOrigin = normalizeOrigin(origin);
  return getAllowedOrigins().includes(normalizedOrigin);
};

export const getPublicRuntimeConfig = () => ({
  nodeEnv: process.env.NODE_ENV || "development",
  allowedOrigins: getAllowedOrigins(),
  jwtConfigured: Boolean(process.env.JWT_SECRET?.trim()),
});
