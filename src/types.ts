export interface ChartDataPoint {
  name: string;
  value: number;
  category?: string; // For grouping (e.g., 'Plan', 'Alternative', 'Average')
  unit?: string;
}

export interface AreaDataPoint {
  name: string; // e.g., "Office", "Meeting Room"
  value: number; // Area in m2
  type: string; // "Plan" or "Alternative"
}

export interface SimilarFacilityData {
  name: string;
  costPerArea: number; // 1000 KRW / m2
  category: 'Facility' | 'Average' | 'Review';
}

export interface AnalysisResult {
  markdownReport: string;
  charts: {
    similarFacilities: SimilarFacilityData[];
    planAreas: AreaDataPoint[];
    alternativeAreas: AreaDataPoint[];
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
