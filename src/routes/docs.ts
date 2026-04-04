import { Router, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import openApiDocument from "../docs/openapi";

const router = Router();

router.get("/openapi.json", (_req: Request, res: Response) => {
  res.json(openApiDocument);
});

router.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: "Satria Backend API Docs",
    swaggerOptions: {
      persistAuthorization: true,
    },
  }),
);

export default router;
