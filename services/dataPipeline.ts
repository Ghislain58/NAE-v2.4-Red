
import { GoogleGenAI } from "@google/genai";
import { ContextData } from "../types";

/**
 * Service d'ingestion haute fidélité.
 * Utilise Gemini avec Google Search Grounding pour extraire des données réelles.
 */
export async function fetchLiveContext(asset: string, event: string): Promise<ContextData> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Prompt ultra-structuré pour forcer Gemini à extraire la Microstructure et les Dérivés
  const prompt = `
    TASK: Execute INSTITUTIONAL GRADE data ingestion for ${asset} regarding context: ${event}.
    
    You are feeding a 'Temporal Asymmetry Engine'. You must separate SLOW macro data from REALTIME microstructure.
    
    REQUIRED STRUCTURE (Return ONLY these 4 sections):
    
    1. FACTUAL (Slow/Macro): 
       - Current price, Market Cap, 24h Volume.
       - Key technical levels (Support/Resistance).
       - Macro correlation (DXY, Yields) if relevant.
    
    2. MEDIATIC (Moderate): 
       - Scan major financial wires (Reuters, Bloomberg). 
       - List top 3 headlines.
       - Detect narrative framing: Is it "Fear", "Greed", or "Uncertainty"?
    
    3. SOCIAL (Fast): 
       - X/Reddit sentiment. 
       - Look for "Retail FOMO" vs "Capitulation". 
       - Trending hashtags or viral narratives.
    
    4. BEHAVIORAL & MICROSTRUCTURE (Realtime/High-Freq):
       - DERIVATIVES: Funding Rates, Open Interest (OI) changes, Basis.
       - OPTIONS: Implied Volatility (IV) levels, Skew (Put/Call ratio), Gamma Exposure (GEX).
       - ORDER FLOW: CVD (Cumulative Volume Delta), Spot vs Perp divergence, Order Book Imbalance (Bid/Ask depth).
       - ON-CHAIN (if crypto): Exchange Inflows/Outflows, Whale wallet movements.
    
    SEARCH CONSTRAINT: Prioritize data from the last 12 hours for Microstructure. Use specific numbers (e.g., "Funding is 0.01%", "IV up 5%").
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Essential for deep search reasoning
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // Zero creativity, purely extraction
      },
    });

    const text = response.text || "";
    
    // Log des sources pour vérifier si on chope bien du Coinglass/Skew/Greeks.live etc.
    console.debug("NAE Microstructure Feed - Sources:", response.candidates?.[0]?.groundingMetadata?.groundingChunks);

    return {
      factual: extractLayer(text, "FACTUAL"),
      mediatic: extractLayer(text, "MEDIATIC"),
      social: extractLayer(text, "SOCIAL"),
      positioning: extractLayer(text, "BEHAVIORAL") // Maps "BEHAVIORAL & MICROSTRUCTURE" to positioning
    };
  } catch (error) {
    console.error("Pipeline Ingestion Error:", error);
    throw new Error("Microstructure feed connection failed.");
  }
}

function extractLayer(text: string, layerName: string): string {
  // Regex robuste pour capturer les sections même si le modèle ajoute des titres
  // On cherche "LAYERNAME" suivi de n'importe quoi jusqu'au prochain mot clé de couche
  const regex = new RegExp(`${layerName}.*?[:\\n]([\\s\\S]*?)(?=(?:\\d\\.|FACTUAL|MEDIATIC|SOCIAL|BEHAVIORAL|$))`, 'i');
  const match = text.match(regex);
  return match ? match[1].trim() : `[DATA GAP] No real-time ${layerName} microstructure found.`;
}
