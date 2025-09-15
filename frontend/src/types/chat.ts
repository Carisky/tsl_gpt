export interface Chat {
  id: number;
  title: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  chatId: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
  model?: string;
}

export interface ChatListResponse {
  chats: Chat[];
}

export interface ChatDetailResponse {
  chat: Chat;
  messages: Message[];
}

export interface CreateChatRequest {
  title?: string;
  model?: string;
}

export interface CreateChatResponse {
  chat: Chat;
}

export interface SendMessageRequest {
  content: string;
  model?: string;
}

export interface SendMessageResponse {
  message: Message; // user message
  reply: Message;   // assistant reply
}

export interface UpdateChatRequest {
  title: string;
}

export interface UpdateChatResponse {
  chat: Chat;
}
