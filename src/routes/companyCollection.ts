import { Router } from "express";
import {
  createCompanyCollection,
  getAllCompanyCollections,
  getCompanyCollectionById,
  updateCompanyCollection,
  deleteCompanyCollection,
} from "../controllers/companyCollectionController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, createCompanyCollection);
router.get("/", authenticate, getAllCompanyCollections);
router.get("/:id", authenticate, getCompanyCollectionById);
router.put("/:id", authenticate, updateCompanyCollection);
router.delete("/:id", authenticate, deleteCompanyCollection);

export default router;
