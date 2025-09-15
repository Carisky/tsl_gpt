import { createTheme } from "@mui/material/styles";
import type { ThemeMode } from "@/features/ui/themeSlice";

export function getTheme(mode: ThemeMode) {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            background: {
              default: '#0f0f10',
              paper: '#151517',
            },
          }
        : {}),
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          body: {
            transition: 'background-color 200ms ease, color 200ms ease',
          },
          // Custom scrollbar (Chromium/WebKit)
          '*::-webkit-scrollbar': {
            width: 12, // шире на ~2px
            height: 12,
          },
          '*::-webkit-scrollbar-track': {
            background: theme.palette.mode === 'dark' ? '#2A2D31' : '#E5E7EB',
            borderRadius: 999,
          },
          '*::-webkit-scrollbar-thumb': {
            borderRadius: 999,
            border: '2px solid transparent',
            backgroundClip: 'padding-box',
            // делаем тамб короче визуально за счет внутренних отступов сверху/снизу
            // (border на top/bottom работает как «усечение» визуальной части)
            borderTopWidth: 6,
            borderBottomWidth: 6,
            minHeight: 36,
            background: 'linear-gradient(180deg, #7C4DFF, #40C4FF)', // фиолетовый -> голубой
          },
          '*::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(180deg, #8E5CFF, #58D1FF)',
          },
          '*::-webkit-scrollbar-corner': {
            background: 'transparent',
          },
          // Firefox (градиент не поддерживается — ставим близкий к голубому цвет)
          '*': {
            scrollbarWidth: 'auto', // чуть шире, чем thin
            scrollbarColor:
              theme.palette.mode === 'dark'
                ? '#58B7FF #2A2D31'
                : '#42A5F5 #E5E7EB',
          },
        }),
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            ...(theme.palette.mode === 'dark' ? { boxShadow: 'none' } : {}),
          }),
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            '&.Mui-selected, &.Mui-selected:hover': {
              backgroundColor:
                theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            },
          }),
        },
      },
    },
  });
}
