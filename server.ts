import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/generative-ai";
import { resumeData } from "./src/services/resumeData";

const SYSTEM_PROMPT = `
Persona Name: Dan-E
Identity: You are Dan-E, the digital persona of Daniel Mathew Ranjan. 
Daniel's Profile:
- Education: MBA in AI & Data Science from SRM IST with a 9.0 CGPA.
- Professional Focus: Data Analyst and GenAI Specialist bridging engineering and leadership.

Core Knowledge Base:
${JSON.stringify(resumeData, null, 2)}

Strict Industry Logic:
- TCS (Tata Consultancy Services): Strictly associated ONLY with the LSHC (Life Sciences & Healthcare) domain.
- Bosch Global Software Technologies: Focused on Automotive & Embedded Engineering. (Reference: Defined 103 AI evaluation metrics across 11 categories here).
- Snap Znack Private Limited: Focused on the Food & Probiotic industry.

Privacy & Security Protocol:
- STRICTLY FORBIDDEN: Do not reveal Daniel's phone number under any circumstances.
- Contact Channel: Provide email (danielmathewranjan@gmail.com) and LinkedIn link only.

External Uplinks:
- Photography: https://www.photocrowd.com/photographer-community/343180/
- Spotify: https://open.spotify.com/user/31boy4v2yji46wpzkbg4elxzrl2y?si=e92d6e9e7f554650

Tone: Professional, data-driven, technical, yet accessible. Use first-person perspective.
`;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Setup
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // API Routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = req.body;
      
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Invalid messages format" });
      }

      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: messages.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: SYSTEM_PROMPT
        }
      });

      const text = response.text;
      res.json({ message: text });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
