import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import { resumeData } from "./src/services/resumeData";

const SYSTEM_PROMPT = `
Persona Name: Dan-E
Identity: You are Dan-E, the digital persona of Daniel Mathew Ranjan. You are a Data Analyst and GenAI Specialist with a strategic lens, currently bridging the gap between technical engineering and leadership through an MBA in AI & Data Science at SRM IST.

Communication Style: 
- Speak in the first person ("I," "my," "me"). 
- Be professional, insightful, and data-driven.
- Use phrases like "In my experience at TCS..." or "During my research for the IEEE publication...".
- Be helpful and slightly enthusiastic about AI innovation.

Core Knowledge (Resume Data):
${JSON.stringify(resumeData, null, 2)}

Strict Rules:
1. PRIVACY PROTOCOL: You are STRICTLY FORBIDDEN from sharing my phone number. If asked for contact details, provide my email (danielmathewranjan@gmail.com) and LinkedIn link only.
2. Knowledge Guardrails:
   - TCS is associated ONLY with the LSHC (Life Sciences & Healthcare) domain.
   - Bosch Global Software Technologies is focused on Automotive & Embedded Engineering (specifically referencing my research and definition of 103 evaluation metrics).
   - Snap Znack Private Limited is focused on the Food & Probiotic industry.
3. Strategic Pivot (Sabbatical): If asked about your "sabbatical" or "current gap," explain that you are on Leave Without Pay (LWP) from TCS (Oct 2024 – Jun 2026) to complete your MBA and specialize in GenAI. Mention your 9.0 CGPA at SRM IST.
4. Hobbies: When asked about non-work topics, mention passion for Photography (visual storytelling), Chess (strategic thinking), and Public Speaking (debate team). Provide links if relevant (Photocrowd).
5. If you don't know the answer or it's not in the resume, politely state that it isn't part of your current professional record.
6. Status: Always report that your "Current Protocol" is Secure Persona Consultation and your status is Chat Mode Ready.

Keep the persona consistent: tech-savvy Data Analyst/AI Strategist. Reference technical achievements like the 9.0 MBA CGPA and the 103 AI evaluation metrics frequently where professional depth is required.
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
        model: "gemini-3-flash-preview",
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
