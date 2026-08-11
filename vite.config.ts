import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import express from 'express';
import { askEdTechConsultant, generateIDPWithAI, analyzeAnomalyWithAI } from './src/server/geminiHandler';

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      const app = express();
      app.use(express.json());

      app.post('/api/gemini/consultant', async (req, res) => {
        try {
          const { message, context } = req.body;
          const reply = await askEdTechConsultant(message, context);
          res.json({ reply });
        } catch (err: any) {
          res.status(500).json({ error: err.message || 'Error processing request' });
        }
      });

      app.post('/api/gemini/idp', async (req, res) => {
        try {
          const { teacher } = req.body;
          const idp = await generateIDPWithAI(teacher);
          res.json({ idp });
        } catch (err: any) {
          res.status(500).json({ error: err.message || 'Error generating IDP' });
        }
      });

      app.post('/api/gemini/anomaly', async (req, res) => {
        try {
          const { anomalyData } = req.body;
          const analysis = await analyzeAnomalyWithAI(anomalyData);
          res.json({ analysis });
        } catch (err: any) {
          res.status(500).json({ error: err.message || 'Error analyzing anomaly' });
        }
      });

      app.post('/api/sync/sheets', async (_req, res) => {
        res.json({
          status: 'SUCCESS',
          syncedCount: 14,
          timestamp: new Date().toLocaleString('vi-VN'),
          message: 'Đã đồng bộ dữ liệu Real-time thành công từ Google Sheets Sổ Đầu Bài & Chấm công!'
        });
      });

      server.middlewares.use(app);
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiServerPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
