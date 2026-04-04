import { Router } from "express";
import {
  createBookmark,
  getAllBookmarks,
  getBookmarkById,
  getAllCompaniesByStatus,
  getAllBookmarksByStatus,
  updateBookmark,
  deleteBookmark,
} from "../controllers/bookmarkCollectionController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.post("/", authenticate, createBookmark);
router.get("/", authenticate, getAllBookmarks);
router.get("/companies/status/:status", authenticate, getAllCompaniesByStatus);
router.get("/status/:status", authenticate, getAllBookmarksByStatus);
router.get("/:id", authenticate, getBookmarkById);
router.put("/:id", authenticate, updateBookmark);
router.delete("/:id", authenticate, deleteBookmark);

export default router;
