"use client";

import { useEffect, useRef, useState } from 'react';
import type { Chat, Message } from '@/types/chat';
import { Box, Stack, Typography, Paper, TextField, IconButton, CircularProgress, Button, Menu, MenuItem } from '@mui/material';
import { useI18n } from '@/i18n/useI18n';
import SendIcon from '@mui/icons-material/Send';

interface Props {
  chat: Chat | null;
  messages: Message[];
  onSend: (text: string, model?: string) => Promise<void>;
  isSending: boolean;
  allowedModels: string[];
  currentModel?: string;
}

export default function ChatPane({ chat, messages, onSend, isSending, allowedModels, currentModel }: Props) {
  const { t } = useI18n();
  const [input, setInput] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedModel, setSelectedModel] = useState<string | undefined>(currentModel);
  const open = Boolean(anchorEl);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedModel(currentModel);
  }, [currentModel]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const submit = async () => {
    const text = input.trim();
    if (!text || !chat || isSending) return;
    setInput('');
    await onSend(text, selectedModel);
  };

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, overflow: 'hidden' }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight={600}>{chat ? chat.title : t('chat.pane.select_chat')}</Typography>
        <div>
          <Button variant="outlined" size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
            {selectedModel || currentModel || t('chat.pane.model')}
          </Button>
          <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
            {allowedModels.map((m) => (
              <MenuItem key={m} selected={m === selectedModel} onClick={() => { setSelectedModel(m); setAnchorEl(null); }}>
                {m}
              </MenuItem>
            ))}
          </Menu>
        </div>
      </Stack>
      <Box ref={listRef} sx={{ p: 2, overflowY: 'auto', flex: 1, backgroundColor: 'background.default' }}>
        {messages.length === 0 ? (
          <Typography color="text.secondary">{t('chat.pane.start')}</Typography>
        ) : (
          <Stack spacing={1.5}>
            {messages.map((m) => (
              <Stack key={m.id} alignItems={m.role === 'user' ? 'flex-end' : 'flex-start'}>
                <Paper
                  sx={(theme) => ({
                    p: 1.5,
                    maxWidth: '75%',
                    bgcolor: m.role === 'user'
                      ? theme.palette.primary.main
                      : (theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100'),
                    color: m.role === 'user'
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.primary,
                  })}
                  elevation={m.role === 'user' ? 2 : 1}
                >
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {m.role === 'user' ? t('chat.pane.you') : t('chat.pane.assistant')}
                  </Typography>
                  <Typography sx={{ whiteSpace: 'pre-wrap' }}>{m.content}</Typography>
                </Paper>
              </Stack>
            ))}
          </Stack>
        )}
      </Box>
      <Box component="form" onSubmit={(e) => { e.preventDefault(); submit(); }} sx={{ p: 1.5, borderTop: 1, borderColor: 'divider' }}>
        <Stack direction="row" spacing={1}>
          <TextField
            placeholder={t('chat.pane.placeholder')}
            fullWidth
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            disabled={!chat || isSending}
            InputProps={{
              sx: (theme) => ({
                bgcolor: theme.palette.mode === 'dark' ? 'background.paper' : undefined,
              }),
            }}
          />
          <IconButton color="primary" onClick={submit} disabled={!chat || isSending}>
            {isSending ? <CircularProgress size={20} /> : <SendIcon />}
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
}
