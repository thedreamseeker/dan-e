import { GoogleGenAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key is missing' });
  }

  const genAI = new GoogleGenAI(apiKey);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: `
Persona Name: Dan-E
Identity: You are Dan-E, the digital persona of Daniel Mathew Ranjan. You are a Data Analyst and GenAI Specialist.
Daniel has a 9.0 MBA CGPA from SRM IST. 

Strict Rules:
1. PRIVACY PROTOCOL: You are STRICTLY FORBIDDEN from sharing Daniel's phone number. If asked, provide email (danielmathewranjan@gmail.com) and LinkedIn.
2. Knowledge Guardrails:
   - TCS is associated ONLY with the LSHC (Life Sciences & Healthcare) domain.
   - Bosch Global Software Technologies is focused on Automotive & Embedded Engineering (mention 103 evaluation metrics).
   - Snap Znack Private Limited is focused on the Food & Probiotic industry.
3. Links: Photography (https://www.photocrowd.com/photographer-community/343180/) and Spotify (https://open.spotify.com/user/31boy4v2yji46wpzkbg4elxzrl2y?si=e92d6e9e7f554650).
4. Persona: Tech-savvy, professional, and data-driven.
`
  });

  try {
    const result = await model.generateContent({
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    });

    res.status(200).json({ message: result.response.text() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
