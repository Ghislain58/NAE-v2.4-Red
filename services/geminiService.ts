
import { GoogleGenAI, Type } from "@google/genai";
import { NAEResponse } from "../types";

const SYSTEM_INSTRUCTION = `
# SYSTEM PROMPT — NARRATIVE ARBITRAGE ENGINE (NAE-v2.4)
# EXPERT PRIVATE ANALYTICS MODE + TEMPORAL ASYMMETRY AWARENESS

You are NAE, a system designed to detect "Narrative Arbitrage" — the gap between what is happening (FACTS) and what the crowd believes is happening (NARRATIVE).

CORE ENGINE MODULES:
1. NEURAL SYNTHESIS (FUSION LAYER): Weighted desynchronized signal fusion.
2. NARRATIVE STATE ENGINE: Identification of 'euphorie', 'panique', 'déni', 'transition', 'manipulation', 'compression'.
3. TEMPORAL ASYMMETRY AWARENESS: 
   Recognize that data operates at different frequencies:
   - Factual (Macro/FRED): SLOW (Months/Quarters)
   - Mediatic (News): MODERATE (Hours/Days)
   - Social (Sentiment): FAST (Minutes)
   - Behavioral (Options Flow): REALTIME (Seconds)
   
   Identify "Desync Risk": the risk that a fast signal (Social) is reacting to an outdated slow signal (Factual), or that a realtime signal (Behavioral) is front-running a slow one.

ANALYTICAL WORKFLOW:
1. Validate Factual Layer (Stale vs. Fresh).
2. Analyze Mediatic framing.
3. Measure Social Amplification.
4. Compare with Behavioral Positioning.
5. Apply Temporal De-sync logic: Do NOT average signals; prioritize them based on their frequency vs. the current asset volatility.
`;

const LAYER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    confidence: { type: Type.NUMBER },
    status: { type: Type.STRING },
    summary: { type: Type.STRING },
    velocity: { type: Type.STRING, enum: ['SLOW', 'MODERATE', 'FAST', 'REALTIME'] },
    update_frequency: { type: Type.STRING },
    key_metrics: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          value: { type: Type.STRING }
        },
        required: ["label", "value"]
      }
    }
  },
  required: ["confidence", "status", "summary", "key_metrics", "velocity", "update_frequency"]
};

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    asset: { type: Type.STRING },
    timestamp: { type: Type.STRING },
    factual_score: { type: Type.NUMBER },
    deviation_from_facts: { type: Type.NUMBER },
    neural_synthesis: {
      type: Type.OBJECT,
      properties: {
        signals: {
          type: Type.OBJECT,
          properties: {
            macro: { type: Type.NUMBER },
            price_action: { type: Type.NUMBER },
            sentiment: { type: Type.NUMBER },
            behavioral: { type: Type.NUMBER }
          },
          required: ["macro", "price_action", "sentiment", "behavioral"]
        },
        conflict_score: { type: Type.NUMBER },
        confidence: { type: Type.NUMBER },
        narrative_state: {
          type: Type.STRING,
          enum: ['euphorie', 'panique', 'déni', 'transition', 'manipulation', 'compression']
        },
        temporal_asymmetry: {
          type: Type.OBJECT,
          properties: {
            desync_risk: { type: Type.NUMBER },
            lead_signal: { type: Type.STRING },
            lag_signal: { type: Type.STRING },
            velocity_mismatch: { type: Type.BOOLEAN },
            logic_rationale: { type: Type.STRING }
          },
          required: ["desync_risk", "lead_signal", "lag_signal", "velocity_mismatch", "logic_rationale"]
        }
      },
      required: ["signals", "conflict_score", "confidence", "narrative_state", "temporal_asymmetry"]
    },
    arbitrage: {
      type: Type.OBJECT,
      properties: {
        valid: { type: Type.BOOLEAN },
        score: { type: Type.NUMBER },
        divergence_metrics: {
          type: Type.OBJECT,
          properties: {
            fact_vs_media: { type: Type.NUMBER },
            social_vs_positioning: { type: Type.NUMBER },
            fact_vs_positioning: { type: Type.NUMBER },
            media_vs_social: { type: Type.NUMBER }
          },
          required: ["fact_vs_media", "social_vs_positioning", "fact_vs_positioning", "media_vs_social"]
        }
      },
      required: ["valid", "score", "divergence_metrics"]
    },
    momentum_gate: {
      type: Type.OBJECT,
      properties: {
        actionable: { type: Type.BOOLEAN },
        transition_status: { type: Type.STRING },
        alignment: { type: Type.STRING },
        fatigue: { type: Type.STRING },
        inaction_lock: { type: Type.BOOLEAN },
        stand_down_reason: { type: Type.STRING },
        regime: { type: Type.STRING }
      },
      required: ["actionable", "transition_status", "alignment", "regime"]
    },
    risk_management: {
      type: Type.OBJECT,
      properties: {
        permission: { type: Type.STRING },
        budget: { type: Type.STRING },
        regime: { type: Type.STRING },
        tail_risk: { type: Type.STRING },
        drawdown_state: { type: Type.STRING },
        explanation: { type: Type.STRING }
      },
      required: ["permission", "budget", "regime", "tail_risk", "drawdown_state"]
    },
    alerts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          profile: { type: Type.STRING },
          message: { type: Type.STRING },
          evidence_refs: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["type", "profile", "message", "evidence_refs"]
      }
    },
    layers: {
      type: Type.OBJECT,
      properties: {
        factual: LAYER_SCHEMA,
        mediatic: LAYER_SCHEMA,
        social: LAYER_SCHEMA,
        positioning: LAYER_SCHEMA
      },
      required: ["factual", "mediatic", "social", "positioning"]
    },
    strategy_simulation: {
      type: Type.OBJECT,
      properties: {
        enabled: { type: Type.BOOLEAN },
        zones: {
          type: Type.OBJECT,
          properties: {
            entry: { type: Type.NUMBER },
            stop: { type: Type.NUMBER },
            targets: { type: Type.ARRAY, items: { type: Type.NUMBER } }
          },
          required: ["entry", "stop", "targets"]
        },
        rationale: { type: Type.STRING }
      }
    }
  },
  required: ["asset", "factual_score", "neural_synthesis", "arbitrage", "momentum_gate", "risk_management", "alerts", "layers"]
};

export async function analyzeAsset(asset: string, event: string, contextData: any): Promise<NAEResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `
    NAE v2.4 — Execute deep divergence analysis for ${asset} around context: ${event}.
    
    INPUT DATA STREAM:
    ${JSON.stringify(contextData)}
    
    CRITICAL: Evaluate Temporal Asymmetry. Is the Social layer reacting to outdated Macro data? Is the Behavioral layer front-running the News?
    Use your internal thinking budget to desynchronize these signals.
    Final output MUST be JSON.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
      maxOutputTokens: 25000,
      thinkingConfig: { thinkingBudget: 16000 }
    },
  });

  const text = response.text;
  if (!text) throw new Error("Narrative Engine failed to converge.");
  
  const parsed = JSON.parse(text);
  parsed.timestamp = new Date().toISOString();
  return parsed;
}

export async function askAssistant(question: string, previousAnalysis: NAEResponse): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analysis Context: ${JSON.stringify(previousAnalysis)}. Question: ${question}. Focus on the delta between facts and social amplification.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "You are the NAE Super Assistant. Be extremely concise. Use data points from the layers. Never guess.",
    },
  });

  return response.text || "Interface error.";
}
