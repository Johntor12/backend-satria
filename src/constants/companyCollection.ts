import { CompanyMethod as PrismaCompanyMethod } from "../generated/prisma";

export const ALLOWED_COMPANY_METHODS = [
  "Transfer Pricing",
  "Debt Shifting",
  "Royalty Stripping",
  "Shell Layering",
] as const;

export const ALLOWED_RISK_TIERS = [
  "Critical",
  "High",
  "Medium",
  "Low",
] as const;

export type CompanyMethod = (typeof ALLOWED_COMPANY_METHODS)[number];
export type RiskTierValue = (typeof ALLOWED_RISK_TIERS)[number];
export type PrismaCompanyMethodValue =
  (typeof PrismaCompanyMethod)[keyof typeof PrismaCompanyMethod];
type CompanyMethodLike = PrismaCompanyMethodValue | CompanyMethod | string;

const METHOD_SET = new Set<string>(ALLOWED_COMPANY_METHODS);
const RISK_TIER_SET = new Set<string>(ALLOWED_RISK_TIERS);
const RISK_TIER_ORDER = new Map<RiskTierValue, number>(
  ALLOWED_RISK_TIERS.map((riskTier, index) => [riskTier, index]),
);
const API_TO_PRISMA_METHOD: Record<CompanyMethod, PrismaCompanyMethodValue> = {
  "Transfer Pricing": PrismaCompanyMethod.TransferPricing,
  "Debt Shifting": PrismaCompanyMethod.DebtShifting,
  "Royalty Stripping": PrismaCompanyMethod.RoyaltyStripping,
  "Shell Layering": PrismaCompanyMethod.ShellLayering,
};
const PRISMA_TO_API_METHOD: Record<PrismaCompanyMethodValue, CompanyMethod> = {
  [PrismaCompanyMethod.TransferPricing]: "Transfer Pricing",
  [PrismaCompanyMethod.DebtShifting]: "Debt Shifting",
  [PrismaCompanyMethod.RoyaltyStripping]: "Royalty Stripping",
  [PrismaCompanyMethod.ShellLayering]: "Shell Layering",
};

export const isCompanyMethod = (value: string): value is CompanyMethod =>
  METHOD_SET.has(value);

export const isRiskTier = (value: string): value is RiskTierValue =>
  RISK_TIER_SET.has(value);

export const toPrismaCompanyMethods = (
  methods: CompanyMethod[],
): PrismaCompanyMethodValue[] => methods.map((method) => API_TO_PRISMA_METHOD[method]);

export const toApiCompanyMethods = (
  methods: CompanyMethodLike[],
): CompanyMethod[] =>
  methods.flatMap((method) => {
    if (isCompanyMethod(method)) {
      return [method];
    }

    const mappedMethod = PRISMA_TO_API_METHOD[method as PrismaCompanyMethodValue];
    return mappedMethod ? [mappedMethod] : [];
  });

export const serializeCompanyCollection = <
  T extends { methods: CompanyMethodLike[] },
>(
  company: T,
): Omit<T, "methods"> & { methods: CompanyMethod[] } => ({
  ...company,
  methods: toApiCompanyMethods(company.methods),
});

export const sortByRiskTierDescending = <
  T extends { riskTier: RiskTierValue; createdAt: Date },
>(
  companies: T[],
): T[] =>
  [...companies].sort((left, right) => {
    const tierOrderDiff =
      (RISK_TIER_ORDER.get(left.riskTier) ?? Number.MAX_SAFE_INTEGER) -
      (RISK_TIER_ORDER.get(right.riskTier) ?? Number.MAX_SAFE_INTEGER);

    if (tierOrderDiff !== 0) {
      return tierOrderDiff;
    }

    return right.createdAt.getTime() - left.createdAt.getTime();
  });
