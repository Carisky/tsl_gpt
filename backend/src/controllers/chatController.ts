import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../prisma/client';
import { AuthRequest } from '../middlewares/authMiddleware';
import config from '../config/config';
import { redactSensitive } from '../utils/redact';
import OpenAI from 'openai';

const client = new OpenAI({ apiKey: config.openaiApiKey });

function generateMockReply(input: string, history: Array<{ role: string; content: string }> = []) {
  const lastUser = input.trim();
  const prefix = 'Мок-ответ (локальный режим):';
  const guide = '\nЭто тестовый ответ без обращения к OpenAI. Можно безопасно разрабатывать UI.';
  // Простейшая имитация рассуждения
  const summary = lastUser.length > 140 ? lastUser.slice(0, 140) + '…' : lastUser;
  return `${prefix}\nВы написали: "${summary}"${guide}`;
}

export const getMeta = async (_req: Request, res: Response) => {
  res.json({ allowedModels: config.allowedModels, defaultModel: config.defaultModel });
};

export const listChats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const chats = await prisma.chat.findMany({
      where: { userId: req.user.id },
      orderBy: { updatedAt: 'desc' },
      select: { id: true, title: true, model: true, createdAt: true, updatedAt: true },
    });
    res.json({ chats });
  } catch (err) {
    next(err);
  }
};

export const createChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const schema = z.object({ title: z.string().min(1).optional(), model: z.string().optional() });
    // Accept empty body (optional fields) to avoid 500 on undefined body
    const data = schema.parse(req.body ?? {});
    const model = data.model && config.allowedModels.includes(data.model) ? data.model : config.defaultModel;
    const chat = await prisma.chat.create({
      data: { userId: req.user.id, title: data.title || 'Новый чат', model },
      select: { id: true, title: true, model: true, createdAt: true, updatedAt: true },
    });
    res.status(201).json({ chat });
  } catch (err) {
    next(err);
  }
};

export const getChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const chatId = Number(req.params.id);
    if (Number.isNaN(chatId)) return res.status(400).json({ message: 'Invalid chat id' });
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId: req.user.id },
      select: { id: true, title: true, model: true, createdAt: true, updatedAt: true },
    });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { id: 'asc' },
      select: { id: true, chatId: true, role: true, content: true, createdAt: true, model: true },
    });
    res.json({ chat, messages });
  } catch (err) {
    next(err);
  }
};

export const deleteChat = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const chatId = Number(req.params.id);
    if (Number.isNaN(chatId)) return res.status(400).json({ message: 'Invalid chat id' });
    const chat = await prisma.chat.findFirst({ where: { id: chatId, userId: req.user.id } });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    await prisma.chat.delete({ where: { id: chatId } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const chatId = Number(req.params.id);
    if (Number.isNaN(chatId)) return res.status(400).json({ message: 'Invalid chat id' });
    const schema = z.object({ content: z.string().min(1), model: z.string().optional() });
    const body = schema.parse(req.body);

    const chat = await prisma.chat.findFirst({ where: { id: chatId, userId: req.user.id } });
    if (!chat) return res.status(404).json({ message: 'Chat not found' });

    const selectedModel = body.model && config.allowedModels.includes(body.model) ? body.model : chat.model;

    // Redact sensitive pieces before sending to OpenAI
    const { redacted: safeUserContent } = redactSensitive(body.content, { enabled: true });

    const userMessage = await prisma.message.create({
      data: { chatId, role: 'user', content: safeUserContent },
      select: { id: true, chatId: true, role: true, content: true, createdAt: true },
    });

    // Build conversation history
    const history = await prisma.message.findMany({
      where: { chatId },
      orderBy: { id: 'asc' },
      select: { role: true, content: true },
    });

    let message = '';
    let usage: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number } | undefined;

    if (config.mockAi || !config.openaiApiKey) {
      message = generateMockReply(safeUserContent, history as any);
    } else {
      const completion = await client.chat.completions.create({
        model: selectedModel,
        messages: history.map((m) => ({ role: m.role as 'user' | 'assistant' | 'system', content: m.content })),
        temperature: 0.3,
      });
      message = completion.choices[0]?.message?.content?.toString() ?? '';
      usage = completion.usage as any;
    }

    const assistantMessage = await prisma.message.create({
      data: {
        chatId,
        role: 'assistant',
        content: message,
        model: selectedModel,
        promptTokens: usage?.prompt_tokens ?? undefined,
        completionTokens: usage?.completion_tokens ?? undefined,
        totalTokens: usage?.total_tokens ?? undefined,
      },
      select: { id: true, chatId: true, role: true, content: true, createdAt: true, model: true },
    });

    // Optionally update chat model if changed
    if (selectedModel !== chat.model) {
      await prisma.chat.update({ where: { id: chatId }, data: { model: selectedModel } });
    }

    // Update updatedAt via a write
    await prisma.chat.update({ where: { id: chatId }, data: { updatedAt: new Date() } });

    res.status(201).json({ message: userMessage, reply: assistantMessage });
  } catch (err) {
    next(err);
  }
};
