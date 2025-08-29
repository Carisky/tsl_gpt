import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../prisma/client';
import { z } from 'zod';
import { AuthRequest } from '../middlewares/authMiddleware';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const signToken = (user: { id: number; email: string }) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  return jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });
    const hash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { email: data.email, password: hash, name: data.name },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });
    const token = signToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);
    const userRecord = await prisma.user.findUnique({ where: { email: data.email } });
    if (!userRecord) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(data.password, userRecord.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    const user = { id: userRecord.id, email: userRecord.email, name: userRecord.name, createdAt: userRecord.createdAt, updatedAt: userRecord.updatedAt };
    const token = signToken(userRecord);
    res.json({ user, token });
  } catch (err) {
    next(err);
  }
};

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const userRecord = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });
    if (!userRecord) return res.status(404).json({ message: 'User not found' });
    res.json({ user: userRecord });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    const schema = z.object({ name: z.string().min(1).optional(), password: z.string().min(6).optional() });
    const data = schema.parse(req.body);
    const updateData: { name?: string; password?: string } = {};
    if (data.name) updateData.name = data.name;
    if (data.password) updateData.password = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData,
      select: { id: true, email: true, name: true, createdAt: true, updatedAt: true },
    });
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const deleteMe = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    await prisma.user.delete({ where: { id: req.user.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

