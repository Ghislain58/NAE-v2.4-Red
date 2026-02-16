
export interface NAEResponse {
  id: string;
  asset: string;
  timestamp: string;
  factual_score: number;
  deviation_from_facts: number;
  neural_synthesis: {
    signals: {
      macro: number;
      price_action: number;
      sentiment: number;
      behavioral: number;
    };
    conflict_score: number;
    confidence: number;
    narrative_state: 'euphorie' | 'panique' | 'déni' | 'transition' | 'manipulation' | 'compression';
    temporal_asymmetry: {
      desync_risk: number; // 0 to 1
      lead_signal: string;
      lag_signal: string;
      velocity_mismatch: boolean;
      logic_rationale: string;
    };
  };
  arbitrage: {
    valid: boolean;
    score: number;
    divergence_metrics: {
      fact_vs_media: number;
      social_vs_positioning: number;
      fact_vs_positioning: number;
      media_vs_social: number;
    };
  };
  momentum_gate: {
    actionable: boolean;
    transition_status: 'CONFIRMED' | 'BUILDING' | 'ABSENT' | 'UNKNOWN';
    alignment: 'FULL' | 'PARTIAL' | 'NONE' | 'UNKNOWN';
    fatigue: 'CONFIRMED' | 'BUILDING' | 'ABSENT' | 'UNKNOWN';
    inaction_lock: boolean;
    stand_down_reason?: string;
    regime: string;
  };
  risk_management: {
    permission: 'ALLOW' | 'REDUCE' | 'BLOCK';
    budget: 'FULL' | 'REDUCED' | 'MINIMAL' | 'ZERO';
    regime: 'TREND' | 'RANGE' | 'TRANSITION' | 'STRESS' | 'UNKNOWN';
    tail_risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN';
    drawdown_state: 'NORMAL' | 'WARNING' | 'LOCKDOWN' | 'UNKNOWN';
    explanation?: string;
  };
  alerts: {
    type: string;
    profile: 'TRADER' | 'RESEARCH' | 'HYBRID';
    message: string;
    evidence_refs: string[];
  }[];
  layers: {
    factual: LayerData;
    mediatic: LayerData;
    social: LayerData;
    positioning: LayerData;
  };
  strategy_simulation?: {
    enabled: boolean;
    zones: {
      entry: number;
      stop: number;
      targets: number[];
    };
    rationale: string;
  };
}

export interface Metric {
  label: string;
  value: string;
}

export interface LayerData {
  confidence: number;
  status: 'OK' | 'MISSING_DATA' | 'UNCERTAIN';
  summary: string;
  key_metrics: Metric[];
  velocity: 'SLOW' | 'MODERATE' | 'FAST' | 'REALTIME';
  update_frequency: string;
}

export interface ContextData {
  factual: string;
  mediatic: string;
  social: string;
  positioning: string;
}
