import { GoogleGenerativeAI } from "@google/generative-ai"; // Adjust import statement
import { useEffect } from "react";

const apiKey = import.meta.env.VITE_GOOGLE_GEMINI_AI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const chatSession = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {
          text: "Generate Travel Plan for location: Las Vegas, for 3 days for a couple with a cheap budget. Give me hotel options with hotel name, hotel address, price, hotel image URL, geo coordinates, rating descriptions, and suggest itinerary with place name, place details, place image URL, geo coordinates, ticket pricing, rating, and time travel for each location for 3 days with each day's plan with the best time to visit in JSON format.\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: "```json\n{\n  ... (JSON response as you provided)\n}\n```",
        },
      ],
    },
  ],
});

// Usage of chatSession
export const runChatSession = async (userInput) => {
  try {
    const result = await chatSession.sendMessage(userInput);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
