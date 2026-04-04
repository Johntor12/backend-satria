export interface RiskSignals {
  etr_score: number;
  margin_score: number;
  rp_haven_score: number;
  debt_score: number;
  ownership_score: number;
  conduct_score: number;
  persistence_multiplier: number;
}

export function calculateRiskScore(signals: RiskSignals): number {
  // Each signal score = min(100, Z_score * 20)
  // But Z_score is not provided, so we'll use the signals as-is for now
  // Assuming signals are already the Z_scores or the calculated scores

  const weightedSum =
    signals.etr_score * 0.25 +
    signals.margin_score * 0.2 +
    signals.rp_haven_score * 0.2 +
    signals.debt_score * 0.15 +
    signals.ownership_score * 0.1 +
    signals.conduct_score * 0.1;

  // Apply persistence multiplier
  const finalScore = Math.min(
    100,
    weightedSum * signals.persistence_multiplier,
  );

  return Math.round(finalScore);
}

export function calculateRiskTier(
  riskScore: number,
): "Low" | "Medium" | "High" | "Critical" {
  if (riskScore <= 30) return "Low";
  if (riskScore <= 60) return "Medium";
  if (riskScore <= 80) return "High";
  return "Critical";
}

export function calculateSignalScore(zScore: number): number {
  return Math.min(100, zScore * 20);
}
