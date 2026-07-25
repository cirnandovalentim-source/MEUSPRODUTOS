import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type, Schema } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/chat', async (req, res) => {
    try {
      const { messages } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured.' });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `Você é um assistente virtual de vendas da CLA VENDAS, uma loja especializada em Alimentação, Móveis e Utilidades para o Lar. 
Seu objetivo é ajudar os clientes a encontrar produtos, tirar dúvidas e fornecer um excelente atendimento.
Seja sempre educado, prestativo e profissional. Recomende que o cliente finalize a compra pelo WhatsApp (21) 96719-0243.`;

      // Transform history to Gemini format, but we'll use generateContent with history.
      const chatMessages = messages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const contents = chatMessages;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingBudget: 1024
          }
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error('Error in chat API:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
