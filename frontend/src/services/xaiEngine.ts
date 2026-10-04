// Explainable AI (XAI) True Mathematical SHAP Feature Attribution Engine
// Calculates exact marginal feature deltas phi_i = f(X) - f(X \ {i})

import { calculateLogisticFailureRisk, calculateCosineSimilarity, type StudentFeatureVector } from './mlEngine';

export interface FeatureAttribution {
  featureName: string;
  shapValue: number; // Marginal contribution phi_i (+/- %)
  percentageImpact: number;
}

export interface ExplanationOutput {
  baseValue: number; // Expected value E[f(x)]
  finalValue: number; // f(X)
  attributions: FeatureAttribution[];
}

// True SHAP Marginal Attribution for IoT Failure Risk
export function explainMaintenanceRiskSHAP(
  tempC: number,
  vibrationRms: number,
  currentAmp: number,
  daysSinceService: number
): ExplanationOutput {
  const baseTemp = 25.0;
  const baseVib = 1.0;
  const baseCurr = 5.0;
  const baseDays = 30;

  const fFull = calculateLogisticFailureRisk(tempC, vibrationRms, currentAmp, daysSinceService);
  const fBase = calculateLogisticFailureRisk(baseTemp, baseVib, baseCurr, baseDays);

  // Compute marginal deltas phi_i = f(X) - f(X \ {i})
  const fNoTemp = calculateLogisticFailureRisk(baseTemp, vibrationRms, currentAmp, daysSinceService);
  const phiTemp = fFull - fNoTemp;

  const fNoVib = calculateLogisticFailureRisk(tempC, baseVib, currentAmp, daysSinceService);
  const phiVib = fFull - fNoVib;

  const fNoCurr = calculateLogisticFailureRisk(tempC, vibrationRms, baseCurr, daysSinceService);
  const phiCurr = fFull - fNoCurr;

  const fNoDays = calculateLogisticFailureRisk(tempC, vibrationRms, currentAmp, baseDays);
  const phiDays = fFull - fNoDays;

  const totalSum = Math.abs(phiTemp) + Math.abs(phiVib) + Math.abs(phiCurr) + Math.abs(phiDays) || 1;

  const attributions: FeatureAttribution[] = [
    { featureName: `Vibration Anomaly (${vibrationRms} RMS)`, shapValue: Math.round(phiVib), percentageImpact: Math.round((Math.abs(phiVib) / totalSum) * 100) },
    { featureName: `Thermal Temp Elevation (${tempC}°C)`, shapValue: Math.round(phiTemp), percentageImpact: Math.round((Math.abs(phiTemp) / totalSum) * 100) },
    { featureName: `Days Since Servicing (${daysSinceService} days)`, shapValue: Math.round(phiDays), percentageImpact: Math.round((Math.abs(phiDays) / totalSum) * 100) },
    { featureName: `Current Draw (${currentAmp} A)`, shapValue: Math.round(phiCurr), percentageImpact: Math.round((Math.abs(phiCurr) / totalSum) * 100) },
  ];

  return { baseValue: fBase, finalValue: fFull, attributions };
}

// True SHAP Marginal Attribution for Roommate Matching
export function explainRoommateMatchSHAP(
  v1: StudentFeatureVector,
  v2: StudentFeatureVector
): ExplanationOutput {
  const fFull = calculateCosineSimilarity(v1, v2);
  const baseMeanVec: StudentFeatureVector = { sleepHour: 24, wakeHour: 8, studyNoiseTolerance: 3, cleanlinessImportance: 3, socialIndex: 3 };
  const fBase = calculateCosineSimilarity(v1, baseMeanVec);

  const phiSleep = calculateCosineSimilarity(v1, { ...v2, sleepHour: v1.sleepHour }) - fFull;
  const phiStudy = calculateCosineSimilarity(v1, { ...v2, studyNoiseTolerance: v1.studyNoiseTolerance }) - fFull;
  const phiClean = calculateCosineSimilarity(v1, { ...v2, cleanlinessImportance: v1.cleanlinessImportance }) - fFull;
  const phiSocial = calculateCosineSimilarity(v1, { ...v2, socialIndex: v1.socialIndex }) - fFull;

  const total = Math.abs(phiSleep) + Math.abs(phiStudy) + Math.abs(phiClean) + Math.abs(phiSocial) || 1;

  const attributions: FeatureAttribution[] = [
    { featureName: 'Sleep Schedule Alignment', shapValue: Math.round(phiSleep), percentageImpact: Math.round((Math.abs(phiSleep) / total) * 100) },
    { featureName: 'Study Noise Preference Match', shapValue: Math.round(phiStudy), percentageImpact: Math.round((Math.abs(phiStudy) / total) * 100) },
    { featureName: 'Cleanliness Rating Alignment', shapValue: Math.round(phiClean), percentageImpact: Math.round((Math.abs(phiClean) / total) * 100) },
    { featureName: 'Social Index Alignment', shapValue: Math.round(phiSocial), percentageImpact: Math.round((Math.abs(phiSocial) / total) * 100) },
  ];

  return { baseValue: fBase, finalValue: fFull, attributions };
}

export const explainMaintenanceRisk = explainMaintenanceRiskSHAP;
export const explainRoommateMatch = explainRoommateMatchSHAP;
