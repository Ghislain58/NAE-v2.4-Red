
import { NAEResponse } from "../types";

const STORAGE_KEY = 'nae_analysis_history';

export const storageService = {
  saveAnalysis: (analysis: NAEResponse) => {
    const history = storageService.getHistory();
    const updated = [analysis, ...history].slice(0, 50); // Keep last 50
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  getHistory: (): NAEResponse[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  clearHistory: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
