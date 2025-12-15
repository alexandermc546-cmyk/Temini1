import { GoogleGenAI, Type } from "@google/genai";
import { TrainDetails } from "../types";

// Helper to get coordinates for major Indian cities to simulate map placement
// In a real production app, this would come from the Gemini function call response or a geocoding API.
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "New Delhi": { lat: 28.6139, lng: 77.2090 },
  "Mumbai": { lat: 19.0760, lng: 72.8777 },
  "Bangalore": { lat: 12.9716, lng: 77.5946 },
  "Chennai": { lat: 13.0827, lng: 80.2707 },
  "Kolkata": { lat: 22.5726, lng: 88.3639 },
  "Hyderabad": { lat: 17.3850, lng: 78.4867 },
  "Ahmedabad": { lat: 23.0225, lng: 72.5714 },
  "Pune": { lat: 18.5204, lng: 73.8567 },
  "Jaipur": { lat: 26.9124, lng: 75.7873 },
  "Lucknow": { lat: 26.8467, lng: 80.9462 },
  "Kanpur": { lat: 26.4499, lng: 80.3319 },
  "Nagpur": { lat: 21.1458, lng: 79.0882 },
  "Patna": { lat: 25.5941, lng: 85.1376 },
  "Indore": { lat: 22.7196, lng: 75.8577 },
  "Bhopal": { lat: 23.2599, lng: 77.4126 },
  "Varanasi": { lat: 25.3176, lng: 82.9739 },
};

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const searchTrainWithGemini = async (trainNo: string): Promise<TrainDetails> => {
  const ai = getAIClient();
  
  // We use the model to "simulate" or "find" the train data.
  // We ask for a JSON response to structure our app state.
  const prompt = `
    I need information about Indian Railways train number "${trainNo}". 
    Please provide the Train Name, a likely Current Station (major city on its route), 
    Next Station, Status (On Time or Delayed), and an estimated time of arrival (ETA) at the next station.
    If the train number is invalid or unknown, return generic realistic data for a train like "Rajdhani Express" or "Shatabdi Express" as a fallback demo.
    Include coordinates for the Current Station if you know them, otherwise I will map them.
    
    Return JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trainNumber: { type: Type.STRING },
            trainName: { type: Type.STRING },
            currentStation: { type: Type.STRING },
            status: { type: Type.STRING },
            nextStation: { type: Type.STRING },
            eta: { type: Type.STRING },
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No data returned");

    const data = JSON.parse(text);
    
    // Attempt to match coordinates
    const coords = CITY_COORDINATES[data.currentStation] || 
                   Object.values(CITY_COORDINATES)[Math.floor(Math.random() * Object.values(CITY_COORDINATES).length)];

    return {
      ...data,
      coordinates: coords
    };
  } catch (error) {
    console.error("Gemini Search Error", error);
    // Fallback data
    return {
      trainNumber: trainNo,
      trainName: "Intercity Express",
      currentStation: "New Delhi",
      status: "On Time",
      nextStation: "Kanpur",
      eta: "14:30",
      coordinates: CITY_COORDINATES["New Delhi"]
    };
  }
};

export const getGeminiAdvice = async (query: string) => {
    const ai = getAIClient();
    // Using tools for grounding if the user asks for specific location info
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                tools: [{ googleMaps: {} }]
            }
        });
        return response;
    } catch (e) {
        console.error(e);
        return null;
    }
}
