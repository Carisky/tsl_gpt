"use client";

import { apiFetch } from "@/lib/api";
import { RootState } from "@/store/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "@/features/auth/authSlice";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "@/store/store";
import type { MeResponse } from "@/types/auth";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useI18n } from "@/i18n/useI18n";
import ChatSidebar from "@/features/chat/ChatSidebar";
import ChatPane from "@/features/chat/ChatPane";
import { chatMeta, createChat, getChat, listChats, sendMessage } from "@/lib/chatApi";
import type { Chat, Message } from "@/types/chat";

export default function DashboardPage() {
  const { token, user } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [allowedModels, setAllowedModels] = useState<string[]>([]);
  const [defaultModel, setDefaultModel] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    (async () => {
      try {
        const data = await apiFetch<MeResponse>("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        dispatch(setUser(data.user));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to load user";
        setError(message);
      }
    })();
  }, [token, dispatch, router]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const meta = await chatMeta(token);
        setAllowedModels(meta.allowedModels);
        setDefaultModel(meta.defaultModel);
      } catch {}
    })();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const data = await listChats(token);
        setChats(data.chats);
        if (data.chats.length && selectedChatId === null) {
          setSelectedChatId(data.chats[0].id);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [token]);

  useEffect(() => {
    if (!token || selectedChatId == null) return;
    (async () => {
      try {
        const data = await getChat(token, selectedChatId);
        setMessages(data.messages);
      } catch (err) {
        console.error(err);
        setMessages([]);
      }
    })();
  }, [token, selectedChatId]);

  const onCreateChat = async () => {
    if (!token) return;
    try {
      const data = await createChat(token, { title: t('chat.new_title'), model: defaultModel });
      setChats((prev) => [data.chat, ...prev]);
      setSelectedChatId(data.chat.id);
      setMessages([]);
    } catch (err) {
      console.error(err);
    }
  };

  const onDeleteChat = async (id: number) => {
    if (!token) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3300"}/api/chats/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setChats((prev) => prev.filter((c) => c.id !== id));
      if (id === selectedChatId) {
        const next = chats.find((c) => c.id !== id) || null;
        setSelectedChatId(next ? next.id : null);
        setMessages([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const selectedChat = useMemo(() => chats.find((c) => c.id === selectedChatId) || null, [chats, selectedChatId]);

  const onSend = async (text: string, model?: string) => {
    if (!token || selectedChatId == null) return;
    try {
      setSending(true);
      const resp = await sendMessage(token, selectedChatId, { content: text, model });
      setMessages((prev) => [...prev, resp.message, resp.reply]);
      setChats((prev) => prev.map((c) => (c.id === selectedChatId ? { ...c, updatedAt: new Date().toISOString(), model: model || c.model } : c)));
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const onLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  if (!token) return null;

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden', minHeight: 0 }}>
      <ChatSidebar chats={chats} selectedChatId={selectedChatId} onSelect={setSelectedChatId} onCreate={onCreateChat} onDelete={onDeleteChat} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">{t('chat.header.title')}</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {user && <Typography variant="body2">{user.email}{user.name ? ` (${user.name})` : ''}</Typography>}
            <Button size="small" variant="outlined" onClick={onLogout}>{t('nav.logout')}</Button>
          </Stack>
        </Stack>
        <ChatPane
          chat={selectedChat}
          messages={messages}
          onSend={onSend}
          isSending={sending}
          allowedModels={allowedModels.length ? allowedModels : [selectedChat?.model || 'gpt-4o-mini']}
          currentModel={selectedChat?.model}
        />
      </Box>
    </Box>
  );
}
