import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  openaiApiKey?: string;
  allowedModels: string[];
  defaultModel: string;
  mockAi: boolean;
}

const config: Config = {
  port: Number(process.env.PORT) || 3300,
  nodeEnv: process.env.NODE_ENV || 'development',
  openaiApiKey: process.env.OPENAI_API_KEY,
  allowedModels: (process.env.ALLOWED_MODELS || 'gpt-4o-mini').split(',').map((s) => s.trim()).filter(Boolean),
  defaultModel: (process.env.DEFAULT_MODEL || (process.env.ALLOWED_MODELS?.split(',')[0] || 'gpt-4o-mini')).trim(),
  mockAi: process.env.MOCK_AI === 'true' || (!process.env.OPENAI_API_KEY && (process.env.NODE_ENV !== 'production')),
};

export default config;
