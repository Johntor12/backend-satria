import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health";
import docsRoutes from "./routes/docs";
import companyCollectionRoutes from "./routes/companyCollection";
import bookmarkCollectionRoutes from "./routes/bookmarkCollection";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Express = express();
const PORT = parseInt(process.env.PORT || "5000", 10);
const allowedOrigin = process.env.CORS_ORIGIN;

// Middleware
app.use(
  cors({
    origin(origin, callback) {
      if (!allowedOrigin || !origin || origin === allowedOrigin) {
        callback(null, true);
        return;
      }

      callback(new Error("Origin not allowed by CORS"));
    },
  }),
);
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
  if (process.env.NODE_ENV === "production") {
    console.log("✅ Production mode enabled");
    console.log(`🌐 Allowed CORS origin: ${allowedOrigin || "not set"}`);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

export default app;
