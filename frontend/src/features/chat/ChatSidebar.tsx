"use client";

import { Chat } from '@/types/chat';
import { List, ListItemButton, ListItemText, Box, Typography, IconButton, Stack, Button } from '@mui/material';
import { useI18n } from '@/i18n/useI18n';
import DeleteIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';

interface Props {
  chats: Chat[];
  selectedChatId: number | null;
  onSelect: (id: number) => void;
  onCreate: () => void;
  onDelete?: (id: number) => void;
}

export default function ChatSidebar({ chats, selectedChatId, onSelect, onCreate, onDelete }: Props) {
  const { t } = useI18n();
  return (
    <Box sx={{ width: 300, borderRight: 1, borderColor: 'divider', height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 1.5 }}>
        <Typography variant="subtitle1" fontWeight={600}>{t('chat.sidebar.title')}</Typography>
        <Button size="small" startIcon={<AddIcon />} onClick={onCreate} variant="outlined">{t('chat.sidebar.new')}</Button>
      </Stack>
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        {chats.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 2, py: 1 }}>{t('chat.sidebar.empty')}</Typography>
        ) : (
          <List>
            {chats.map((c) => (
              <Stack key={c.id} direction="row" alignItems="center" sx={{ pr: 1 }}>
                <ListItemButton
                  selected={c.id === selectedChatId}
                  onClick={() => onSelect(c.id)}
                  sx={(theme) => ({
                    flex: 1,
                    '&.Mui-selected, &.Mui-selected:hover': {
                      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                    },
                  })}
                >
                  <ListItemText
                    primaryTypographyProps={{ noWrap: true }}
                    primary={c.title || 'Чат'}
                    secondary={new Date(c.updatedAt).toLocaleString()}
                  />
                </ListItemButton>
                {onDelete && (
                  <IconButton aria-label="delete" size="small" onClick={() => onDelete(c.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Stack>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
}
