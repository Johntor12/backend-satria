import { Router, Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { buildOpenApiDocument } from "../docs/openapi";

const router = Router();

const getServerUrl = (req: Request): string => {
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

  return host ? `${protocol}://${host}` : `http://localhost:${process.env.PORT || "5000"}`;
};

router.get("/openapi.json", (req: Request, res: Response) => {
  res.json(buildOpenApiDocument(getServerUrl(req)));
});

router.use(
  "/docs",
  swaggerUi.serve,
  (req: Request, res: Response, next: NextFunction) => {
    const openApiDocument = buildOpenApiDocument(getServerUrl(req));

    return swaggerUi.setup(openApiDocument, {
      customSiteTitle: "Satria Backend API Docs",
      swaggerOptions: {
        persistAuthorization: true,
      },
    })(req, res, next);
  },
);

export default router;
