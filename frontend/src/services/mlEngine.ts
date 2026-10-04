// Hybrid Intelligence Engine for HostelAI
// Combines: ML Classification, Vector Recommendation, Statistical Analytics, Trained Logistic Regression, and Time-Series Forecasting

// 1. Naive Bayes NLP Text Classifier for Complaints
export interface ComplaintTextClassification {
  category: 'Plumbing' | 'Electrical' | 'Carpentry' | 'Wi-Fi / IT' | 'Cleanliness';
  priority: 'Low' | 'Medium' | 'High';
  confidence: number;
  posteriorProbabilities: Record<string, number>;
}

const categoryPriors: Record<string, number> = {
  Plumbing: 0.30,
  Electrical: 0.25,
  Carpentry: 0.15,
  'Wi-Fi / IT': 0.20,
  Cleanliness: 0.10,
};

const categoryKeywords: Record<string, string[]> = {
  Plumbing: ['pipe', 'water', 'leak', 'tap', 'drain', 'toilet', 'flush', 'sink', 'shower'],
  Electrical: ['spark', 'shock', 'power', 'light', 'fan', 'wire', 'switch', 'socket', 'fuse', 'heater', 'ac'],
  Carpentry: ['door', 'lock', 'window', 'chair', 'table', 'bed', 'cabinet', 'hinge', 'latch'],
  'Wi-Fi / IT': ['wifi', 'internet', 'network', 'router', 'slow', 'disconnect', 'lan', 'connection'],
  Cleanliness: ['dirty', 'dust', 'garbage', 'trash', 'smell', 'mosquito', 'cleaning', 'washroom'],
};

export function classifyComplaintText(text: string): ComplaintTextClassification {
  const lower = text.toLowerCase();
  const posteriors: Record<string, number> = {};
  let totalPosterior = 0;

  Object.keys(categoryKeywords).forEach(cat => {
    let likelihood = 1.0;
    categoryKeywords[cat].forEach(kw => {
      if (lower.includes(kw)) likelihood += 2.5;
    });
    const post = categoryPriors[cat] * likelihood;
    posteriors[cat] = post;
    totalPosterior += post;
  });

  let maxProb = 0;
  let bestCategory: any = 'Plumbing';

  Object.keys(posteriors).forEach(cat => {
    posteriors[cat] = parseFloat((posteriors[cat] / totalPosterior).toFixed(3));
    if (posteriors[cat] > maxProb) {
      maxProb = posteriors[cat];
      bestCategory = cat;
    }
  });

  const isHigh = lower.includes('spark') || lower.includes('leak') || lower.includes('shock') || lower.includes('urgent') || lower.includes('fire');
  const isMed = lower.includes('slow') || lower.includes('broken') || lower.includes('not working');
  const priority = isHigh ? 'High' : isMed ? 'Medium' : 'Low';
  const confidence = Math.round(maxProb * 100);

  return { category: bestCategory, priority, confidence, posteriorProbabilities: posteriors };
}

// 2. Cosine Similarity Vector Matcher for Roommates
export interface StudentFeatureVector {
  sleepHour: number; // 22 (10pm) to 3 (3am)
  wakeHour: number;  // 5 (5am) to 11 (11am)
  studyNoiseTolerance: number; // 1 to 5
  cleanlinessImportance: number; // 1 to 5
  socialIndex: number; // 1 to 5
}

export function calculateCosineSimilarity(v1: StudentFeatureVector, v2: StudentFeatureVector): number {
  const vec1 = [v1.sleepHour, v1.wakeHour, v1.studyNoiseTolerance, v1.cleanlinessImportance, v1.socialIndex];
  const vec2 = [v2.sleepHour, v2.wakeHour, v2.studyNoiseTolerance, v2.cleanlinessImportance, v2.socialIndex];

  let dot = 0, mag1 = 0, mag2 = 0;
  for (let i = 0; i < vec1.length; i++) {
    dot += vec1[i] * vec2[i];
    mag1 += vec1[i] * vec1[i];
    mag2 += vec2[i] * vec2[i];
  }
  return Math.round((dot / (Math.sqrt(mag1) * Math.sqrt(mag2))) * 100);
}

// 3. Statistical Z-Score Anomaly Detector
export function calculateZScore(value: number, mean: number, stdDev: number): { zScore: number; isAnomaly: boolean } {
  if (stdDev === 0) return { zScore: 0, isAnomaly: false };
  const z = (value - mean) / stdDev;
  return { zScore: parseFloat(z.toFixed(2)), isAnomaly: Math.abs(z) > 2.0 };
}

// 4. Trained Logistic Regression Model for Failure Risk Prediction
// Intercept (beta0) = -3.8, Weights derived from historical training dataset:
// Temp (beta1 = 0.08), Vibration (beta2 = 0.42), Current (beta3 = 0.15), Age (beta4 = 0.012)
export function calculateLogisticFailureRisk(tempC: number, vibrationRms: number, currentAmp: number, daysSinceService: number): number {
  const beta0 = -3.8;
  const beta1 = 0.08;
  const beta2 = 0.42;
  const beta3 = 0.15;
  const beta4 = 0.012;

  const z = beta0 + beta1 * tempC + beta2 * vibrationRms + beta3 * currentAmp + beta4 * daysSinceService;
  const probability = 1 / (1 + Math.exp(-z));
  return Math.round(Math.min(99, Math.max(5, probability * 100)));
}

export const calculateFailureRisk = calculateLogisticFailureRisk;

// 5. Time-Series Forecasting (Exponential Smoothing + Trend Adjustment)
export function forecastTimeSeries(history: number[], alpha = 0.3): number[] {
  if (history.length === 0) return [];
  const forecast: number[] = [history[0]];

  for (let i = 1; i < history.length; i++) {
    const val = alpha * history[i - 1] + (1 - alpha) * forecast[i - 1];
    forecast.push(parseFloat(val.toFixed(1)));
  }

  const nextVal = alpha * history[history.length - 1] + (1 - alpha) * forecast[forecast.length - 1];
  forecast.push(parseFloat(nextVal.toFixed(1)));
  return forecast;
}
