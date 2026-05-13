import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import chatHandler from './api/chat.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Serve static files from root
app.use(express.static(__dirname));

// Route Gemini API requests to the serverless function handler
app.post('/api/chat', (req, res) => {
  chatHandler(req, res);
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dan-E Local Runner active on http://0.0.0.0:${PORT}`);
  console.log(`Ready for deployment to GitHub/Vercel (api/chat.js architecture detected)`);
});
