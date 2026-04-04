import { Response } from "express";
import prisma from "../prisma/client";
import { AuthRequest } from "../middleware/authMiddleware";

type BookmarkStatusType = "Active" | "Archived";

export const createBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, description, companyIds, status, notes } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "name is required." });
    }

    if (!companyIds || !Array.isArray(companyIds) || companyIds.length === 0) {
      return res.status(400).json({ success: false, message: "companyIds array is required and cannot be empty." });
    }

    const statusOptions = ["Active", "Archived"] as const;
    type LocalBookmarkStatusType = (typeof statusOptions)[number];
    let bookmarkStatus: LocalBookmarkStatusType = "Active";

    if (status) {
      if (!statusOptions.includes(status as LocalBookmarkStatusType)) {
        return res.status(400).json({ success: false, message: `status must be one of ${statusOptions.join(", ")}` });
      }
      bookmarkStatus = status as LocalBookmarkStatusType;
    }

    const companies = await prisma.companyCollection.findMany({
      where: { id: { in: companyIds }, userId },
    });

    if (companies.length !== companyIds.length) {
      return res.status(404).json({ success: false, message: "One or more companies not found." });
    }

    const created = await prisma.bookmark.create({
      data: {
        user: { connect: { id: userId } },
        name,
        description,
        status: bookmarkStatus,
        notes,
        companies: {
          create: companyIds.map((companyId: number) => ({
            company: { connect: { id: companyId } },
          })),
        },
      },
      include: {
        companies: { include: { company: true } },
      },
    });

    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error("Create Bookmark error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export const getAllCompaniesByStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) { return res.status(401).json({ success: false, message: "Unauthorized" }); }

    const status = (req.query.status || req.params.status || "").toString();
    const statusOptions = ["Active", "Archived"];

    if (!status || !statusOptions.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid or missing status. Valid values are ${statusOptions.join(", ")}` });
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: { status: status as BookmarkStatusType, userId },
      include: {
        companies: {
          include: { company: true },
        },
      },
    });

    const uniqueCompanies = new Map<number, any>();
    bookmarks.forEach((bookmark) => {
      bookmark.companies.forEach((bc) => {
        if (bc.company && !uniqueCompanies.has(bc.company.id)) {
          uniqueCompanies.set(bc.company.id, bc.company);
        }
      });
    });

    return res.json({ success: true, status, data: Array.from(uniqueCompanies.values()) });
  } catch (error) {
    console.error("Get all companies by status error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export const getAllBookmarks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) { return res.status(401).json({ success: false, message: "Unauthorized" }); }

    const list = await prisma.bookmark.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { companies: { include: { company: true } } },
    });

    return res.json({ success: true, data: list });
  } catch (error) {
    console.error("Get Bookmark list error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export const getBookmarkById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) { return res.status(401).json({ success: false, message: "Unauthorized" }); }

    const id = Number(req.params.id);
    const item = await prisma.bookmark.findUnique({
      where: { id },
      include: { companies: { include: { company: true } } },
    });

    if (!item) { return res.status(404).json({ success: false, message: "Bookmark not found" }); }
    if (item.userId !== userId) { return res.status(403).json({ success: false, message: "Forbidden" }); }

    return res.json({ success: true, data: item });
  } catch (error) {
    console.error("Get Bookmark by id error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export const getAllBookmarksByStatus = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) { return res.status(401).json({ success: false, message: "Unauthorized" }); }

    const status = req.params.status as BookmarkStatusType;
    const statusOptions = ["Active", "Archived"] as const;
    if (!statusOptions.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be ${statusOptions.join(", ")}` });
    }

    const list = await prisma.bookmark.findMany({
      where: { status, userId },
      include: { companies: { include: { company: true } } },
    });

    return res.json({ success: true, data: list });
  } catch (error) {
    console.error("Get Bookmark by status error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export const updateBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) { return res.status(401).json({ success: false, message: "Unauthorized" }); }

    const id = Number(req.params.id);
    const { name, description, companyIds, status, notes } = req.body;

    const bookmark = await prisma.bookmark.findUnique({ where: { id } });
    if (!bookmark) { return res.status(404).json({ success: false, message: "Bookmark not found" }); }
    if (bookmark.userId !== userId) { return res.status(403).json({ success: false, message: "Forbidden" }); }

    const statusOptions = ["Active", "Archived"] as const;
    const updateData: any = { name, description, notes };

    if (status) {
      if (!statusOptions.includes(status as BookmarkStatusType)) {
        return res.status(400).json({ success: false, message: `status must be one of: ${statusOptions.join(", ")}` });
      }
      updateData.status = status as BookmarkStatusType;
    }

    if (companyIds && Array.isArray(companyIds)) {
      const companies = await prisma.companyCollection.findMany({ where: { id: { in: companyIds }, userId } });
      if (companies.length !== companyIds.length) {
        return res.status(404).json({ success: false, message: "One or more companies not found." });
      }

      await prisma.bookmarkCompany.deleteMany({ where: { bookmarkId: id } });

      updateData.companies = {
        create: companyIds.map((companyId: number) => ({ company: { connect: { id: companyId } } })),
      };
    }

    const updated = await prisma.bookmark.update({
      where: { id },
      data: updateData,
      include: { companies: { include: { company: true } } },
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Update Bookmark error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};

export const deleteBookmark = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) { return res.status(401).json({ success: false, message: "Unauthorized" }); }

    const id = Number(req.params.id);
    const bookmark = await prisma.bookmark.findUnique({ where: { id } });
    if (!bookmark) { return res.status(404).json({ success: false, message: "Bookmark not found" }); }
    if (bookmark.userId !== userId) { return res.status(403).json({ success: false, message: "Forbidden" }); }

    await prisma.bookmark.delete({ where: { id } });
    return res.json({ success: true, message: "Bookmark deleted successfully" });
  } catch (error) {
    console.error("Delete Bookmark error:", error);
    return res.status(500).json({ success: false, message: "Internal server error", error });
  }
};
