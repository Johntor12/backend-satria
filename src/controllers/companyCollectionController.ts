import { Request, Response } from "express";
import prisma from "../prisma/client";
import {
  calculateRiskScore,
  calculateRiskTier,
  RiskSignals,
} from "../utils/riskCalculation";
import { AuthRequest } from "../middleware/authMiddleware";
import {
  ALLOWED_COMPANY_METHODS,
  CompanyMethod,
  isCompanyMethod,
  isRiskTier,
  RiskTierValue,
  serializeCompanyCollection,
  sortByRiskTierDescending,
  toPrismaCompanyMethods,
} from "../constants/companyCollection";

const parseMethodFilters = (queryValue: unknown): string[] => {
  if (queryValue === undefined) {
    return [];
  }

  const rawValues = Array.isArray(queryValue) ? queryValue : [queryValue];

  return rawValues
    .flatMap((value) =>
      typeof value === "string" ? value.split(",") : [],
    )
    .map((value) => value.trim())
    .filter(Boolean);
};

const validateMethods = (methods: unknown): methods is CompanyMethod[] =>
  Array.isArray(methods) &&
  methods.every((method) => typeof method === "string" && isCompanyMethod(method));

export const createCompanyCollection = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      companyName,
      companyNickname,
      sector,
      methods,
      revenue,
      etr_score,
      margin_score,
      rp_haven_score,
      debt_score,
      ownership_score,
      conduct_score,
      persistence_multiplier,
    } = req.body;

    if (
      !companyName ||
      !companyNickname ||
      !sector ||
      !methods ||
      !Array.isArray(methods)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "companyName, companyNickname, sector and methods(array) are required.",
      });
    }

    if (!validateMethods(methods)) {
      return res.status(400).json({
        success: false,
        message: `methods must only contain: ${ALLOWED_COMPANY_METHODS.join(", ")}`,
      });
    }

    // Prepare signals for calculation
    const signals: RiskSignals = {
      etr_score: etr_score || 0,
      margin_score: margin_score || 0,
      rp_haven_score: rp_haven_score || 0,
      debt_score: debt_score || 0,
      ownership_score: ownership_score || 0,
      conduct_score: conduct_score || 0,
      persistence_multiplier: persistence_multiplier || 1.0,
    };

    // Calculate risk score and tier
    const riskScore = calculateRiskScore(signals);
    const riskTier = calculateRiskTier(riskScore);

    const created = await prisma.companyCollection.create({
      data: {
        userId,
        companyName,
        companyNickname,
        sector,
        riskScore,
        riskTier,
        methods: toPrismaCompanyMethods(methods),
        revenue: Number(revenue),
        etr_score: signals.etr_score,
        margin_score: signals.margin_score,
        rp_haven_score: signals.rp_haven_score,
        debt_score: signals.debt_score,
        ownership_score: signals.ownership_score,
        conduct_score: signals.conduct_score,
        persistence_multiplier: signals.persistence_multiplier,
      },
    });

    return res.status(201).json({ success: true, data: serializeCompanyCollection(created) });
  } catch (error) {
    console.error("Create CompanyCollection error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const getAllCompanyCollections = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.userId;
    const rawRiskTierFilter =
      typeof req.query.riskTier === "string" ? req.query.riskTier.trim() : undefined;
    const methodFilters = parseMethodFilters(req.query.method);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (rawRiskTierFilter && !isRiskTier(rawRiskTierFilter)) {
      return res.status(400).json({
        success: false,
        message: "riskTier must be one of: Critical, High, Medium, Low",
      });
    }

    const riskTierFilter: RiskTierValue | undefined =
      rawRiskTierFilter && isRiskTier(rawRiskTierFilter)
        ? rawRiskTierFilter
        : undefined;

    const invalidMethodFilters = methodFilters.filter((method) => !isCompanyMethod(method));
    if (invalidMethodFilters.length > 0) {
      return res.status(400).json({
        success: false,
        message: `method must only contain: ${ALLOWED_COMPANY_METHODS.join(", ")}`,
      });
    }

    const validMethodFilters = methodFilters as CompanyMethod[];
    const prismaMethodFilters = toPrismaCompanyMethods(validMethodFilters);

    const list = await prisma.companyCollection.findMany({
      where: {
        userId,
        ...(riskTierFilter ? { riskTier: riskTierFilter } : {}),
        ...(prismaMethodFilters.length > 0
          ? {
              methods: {
                hasSome: prismaMethodFilters,
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });
    return res.json({
      success: true,
      data: sortByRiskTierDescending(list).map(serializeCompanyCollection),
    });
  } catch (error) {
    console.error("Get CompanyCollection list error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const getCompanyCollectionById = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = Number(req.params.id);
    const record = await prisma.companyCollection.findUnique({ where: { id } });

    if (record && record.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    if (!record) {
      return res
        .status(404)
        .json({ success: false, message: "CompanyCollection not found" });
    }

    return res.json({ success: true, data: serializeCompanyCollection(record) });
  } catch (error) {
    console.error("Get CompanyCollection by id error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const updateCompanyCollection = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = Number(req.params.id);
    const updateData = req.body;

    const existingRecord = await prisma.companyCollection.findUnique({
      where: { id },
    });

    if (!existingRecord) {
      return res.status(404).json({
        success: false,
        message: "CompanyCollection not found",
      });
    }

    if (existingRecord.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    if (updateData.methods !== undefined && !validateMethods(updateData.methods)) {
      return res.status(400).json({
        success: false,
        message: `methods must only contain: ${ALLOWED_COMPANY_METHODS.join(", ")}`,
      });
    }

    // If any signal fields are being updated, recalculate risk score and tier
    const signalFields = [
      "etr_score",
      "margin_score",
      "rp_haven_score",
      "debt_score",
      "ownership_score",
      "conduct_score",
      "persistence_multiplier",
    ];
    const hasSignalUpdate = signalFields.some(
      (field) => updateData[field] !== undefined,
    );

    if (hasSignalUpdate) {
      // Get current company data
      const currentCompany = await prisma.companyCollection.findUnique({
        where: { id },
      });
      if (!currentCompany) {
        return res
          .status(404)
          .json({ success: false, message: "CompanyCollection not found" });
      }

      // Prepare signals for calculation
      const signals: RiskSignals = {
        etr_score:
          updateData.etr_score !== undefined
            ? updateData.etr_score
            : currentCompany.etr_score,
        margin_score:
          updateData.margin_score !== undefined
            ? updateData.margin_score
            : currentCompany.margin_score,
        rp_haven_score:
          updateData.rp_haven_score !== undefined
            ? updateData.rp_haven_score
            : currentCompany.rp_haven_score,
        debt_score:
          updateData.debt_score !== undefined
            ? updateData.debt_score
            : currentCompany.debt_score,
        ownership_score:
          updateData.ownership_score !== undefined
            ? updateData.ownership_score
            : currentCompany.ownership_score,
        conduct_score:
          updateData.conduct_score !== undefined
            ? updateData.conduct_score
            : currentCompany.conduct_score,
        persistence_multiplier:
          updateData.persistence_multiplier !== undefined
            ? updateData.persistence_multiplier
            : currentCompany.persistence_multiplier,
      };

      // Calculate new risk score and tier
      const riskScore = calculateRiskScore(signals);
      const riskTier = calculateRiskTier(riskScore);

      updateData.riskScore = riskScore;
      updateData.riskTier = riskTier;
    }

    const updated = await prisma.companyCollection.update({
      where: { id },
      data: {
        ...updateData,
        methods:
          updateData.methods && Array.isArray(updateData.methods)
            ? toPrismaCompanyMethods(updateData.methods as CompanyMethod[])
            : undefined,
      },
    });

    return res.json({ success: true, data: serializeCompanyCollection(updated) });
  } catch (error) {
    console.error("Update CompanyCollection error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const deleteCompanyCollection = async (
  req: AuthRequest,
  res: Response,
) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const id = Number(req.params.id);
    const record = await prisma.companyCollection.findUnique({ where: { id } });

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "CompanyCollection not found",
      });
    }

    if (record.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    await prisma.companyCollection.delete({ where: { id } });
    return res.json({
      success: true,
      message: "CompanyCollection deleted successfully",
    });
  } catch (error) {
    console.error("Delete CompanyCollection error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};
