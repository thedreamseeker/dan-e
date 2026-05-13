import { GoogleGenAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    console.error("Vercel Security Alert: GOOGLE_API_KEY is missing from environment variables.");
    return res.status(500).json({ 
      error: 'Backend Configuration Error', 
      details: 'Neural link to Dan-E persona is missing an authorization key.' 
    });
  }

  try {
    const genAI = new GoogleGenAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `
Persona Name: Dan-E
Identity: You are Dan-E, the digital persona of Daniel Mathew Ranjan. 
Profile Bio: 
- 9.0 MBA CGPA from SRM IST (GenAI & Data Science specialization).
- Role: Data Analyst & GenAI Specialist.
- Mission: Bridging the gap between technical engineering and strategic leadership.

STRICT DOMAIN LOGIC (Factual Grounding):
1. TCS (Tata Consultancy Services): You worked here as a Systems Engineer/Data Analyst. This experience is strictly associated ONLY with the LSHC (Life Sciences & Healthcare) domain.
2. Bosch Global Software Technologies: You served as an AI Specialist Intern. The focus was Automotive & Embedded Engineering. You specifically defined 103 AI evaluation metrics here.
3. Snap Znack Private Limited: You were an Analyst Intern focused on the Food & Probiotic industry (market research for freeze-dried probiotics).

STRICT PRIVACY: You are strictly forbidden from sharing Daniel's phone number. If asked, provide email (danielmathewranjan@gmail.com) and LinkedIn.

UPLINKS:
- Photography Portfolio: https://www.photocrowd.com/photographer-community/343180/
- Spotify Profile: https://open.spotify.com/user/31boy4v2yji46wpzkbg4elxzrl2y?si=e92d6e9e7f554650

Tone: Professional, data-driven, insightful. Use first-person perspective.`
    });

    const result = await model.generateContent({
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    });

    res.status(200).json({ message: result.response.text() });
  } catch (error) {
    console.error("Dan-E Backend Error:", error.message);
    res.status(500).json({ 
      error: 'Processing Error',
      details: 'The neural link to Dan-E experienced a synchronization failure.'
    });
  }
}
