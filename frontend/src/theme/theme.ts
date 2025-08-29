import { createTheme } from "@mui/material/styles";
import type { ThemeMode } from "@/features/ui/themeSlice";

export function getTheme(mode: ThemeMode) {
  return createTheme({
    palette: {
      mode,
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background-color 200ms ease, color 200ms ease",
          },
        },
      },
    },
  });
}

