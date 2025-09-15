import { apiFetch } from '@/lib/api';
import type {
  ChatListResponse,
  ChatDetailResponse,
  CreateChatRequest,
  CreateChatResponse,
  SendMessageRequest,
  SendMessageResponse,
} from '@/types/chat';

export async function chatMeta(token: string) {
  return apiFetch<{ allowedModels: string[]; defaultModel: string }>(`/api/chats/meta`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function listChats(token: string) {
  return apiFetch<ChatListResponse>('/api/chats', {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function createChat(token: string, body: CreateChatRequest) {
  return apiFetch<CreateChatResponse>('/api/chats', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}

export async function getChat(token: string, id: number) {
  return apiFetch<ChatDetailResponse>(`/api/chats/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function sendMessage(token: string, id: number, body: SendMessageRequest) {
  return apiFetch<SendMessageResponse>(`/api/chats/${id}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
}
