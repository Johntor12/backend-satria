import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health";
import docsRoutes from "./routes/docs";
import companyCollectionRoutes from "./routes/companyCollection";
import bookmarkCollectionRoutes from "./routes/bookmarkCollection";
import authRoutes from "./routes/authRoutes";
import {
  getJwtSecret,
  getPublicApiBaseUrl,
  getPublicRuntimeConfig,
  isOriginAllowed,
} from "./config/env";

dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

app.set("trust proxy", 1);

const getRequestOrigin = (req: Request): string | null => {
  const forwardedProtoHeader = req.headers["x-forwarded-proto"];
  const forwardedHostHeader = req.headers["x-forwarded-host"];

  const forwardedProto = Array.isArray(forwardedProtoHeader)
    ? forwardedProtoHeader[0]
    : forwardedProtoHeader?.split(",")[0]?.trim();
  const forwardedHost = Array.isArray(forwardedHostHeader)
    ? forwardedHostHeader[0]
    : forwardedHostHeader?.split(",")[0]?.trim();

  const protocol = forwardedProto || req.protocol;
  const host = forwardedHost || req.get("host");

  return host ? `${protocol}://${host}` : null;
};

// Middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  cors({
    origin(origin, callback) {
      const requestOrigin = getRequestOrigin(req);

      if (!origin || isOriginAllowed(origin) || origin === requestOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
  })(req, res, next);
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api", docsRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/company-collections", companyCollectionRoutes);
app.use("/api/bookmarks", bookmarkCollectionRoutes);
app.use("/api/auth", authRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Start server
async function startServer() {
  const runtimeConfig = getPublicRuntimeConfig();

  if (runtimeConfig.nodeEnv === "production") {
    getJwtSecret();
    getPublicApiBaseUrl();
  }

  if (process.env.NODE_ENV === "production") {
    console.log("✅ Production mode enabled");
  }

  const corsMode = runtimeConfig.wildcardOrigin
    ? "wildcard (*)"
    : runtimeConfig.allowedOrigins.join(", ") || "same-origin only";

  console.log(`🌐 Allowed CORS origins: ${corsMode}`);
  console.log(`🔐 JWT configured: ${runtimeConfig.jwtConfigured ? "yes" : "development fallback"}`);
  console.log(`🔗 Public API base URL: ${runtimeConfig.publicApiBaseUrl || "derived from request"}`);

  app.listen(PORT, "0.0.0.0", () => {
    const bindHost = process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost";
    console.log(`🚀 Server is running on http://${bindHost}:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export default app;
