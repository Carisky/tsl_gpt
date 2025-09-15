import type { Locale } from "@/features/i18n/i18nSlice";

type Dict = Record<string, string>;

export const messages: Record<Locale, Dict> = {
  en: {
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.login": "Login",
    "nav.register": "Register",
    "nav.logout": "Logout",

    "theme.switch_to": "Switch to {mode} mode",
    "theme.mode.light": "light",
    "theme.mode.dark": "dark",

    "chat.sidebar.title": "Chat History",
    "chat.sidebar.new": "New",
    "chat.sidebar.empty": "No chats. Create a new one.",

    "chat.header.title": "Dashboard",
    "chat.header.logout": "Logout",
    "chat.pane.select_chat": "Select a chat",
    "chat.pane.model": "Model",
    "chat.pane.start": "Start the conversation. Type below.",
    "chat.pane.you": "You",
    "chat.pane.assistant": "Assistant",
    "chat.pane.placeholder": "Type a message...",

    "chat.new_title": "New chat",

    "auth.login.title": "Welcome Back",
    "auth.register.title": "Create Account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Name",
    "auth.signin": "Sign In",
    "auth.signup": "Sign Up",
    "auth.no_account": "No account?",
    "auth.have_account": "Have an account?",
    "auth.forgot": "Forgot Password",
  },
  ru: {
    "nav.home": "Главная",
    "nav.dashboard": "Дашборд",
    "nav.login": "Войти",
    "nav.register": "Регистрация",
    "nav.logout": "Выйти",

    "theme.switch_to": "Переключить на {mode}",
    "theme.mode.light": "светлую тему",
    "theme.mode.dark": "тёмную тему",

    "chat.sidebar.title": "История чатов",
    "chat.sidebar.new": "Новый",
    "chat.sidebar.empty": "Нет чатов. Создайте новый.",

    "chat.header.title": "Дашборд",
    "chat.header.logout": "Выйти",
    "chat.pane.select_chat": "Выберите чат",
    "chat.pane.model": "Модель",
    "chat.pane.start": "Начните диалог. Напишите сообщение ниже.",
    "chat.pane.you": "Вы",
    "chat.pane.assistant": "Ассистент",
    "chat.pane.placeholder": "Напишите сообщение...",

    "chat.new_title": "Новый чат",

    "auth.login.title": "С возвращением",
    "auth.register.title": "Создать аккаунт",
    "auth.email": "Email",
    "auth.password": "Пароль",
    "auth.name": "Имя",
    "auth.signin": "Войти",
    "auth.signup": "Зарегистрироваться",
    "auth.no_account": "Нет аккаунта?",
    "auth.have_account": "Уже есть аккаунт?",
    "auth.forgot": "Забыли пароль",
  },
  pl: {
    "nav.home": "Strona główna",
    "nav.dashboard": "Panel",
    "nav.login": "Zaloguj się",
    "nav.register": "Rejestracja",
    "nav.logout": "Wyloguj",

    "theme.switch_to": "Przełącz na tryb {mode}",
    "theme.mode.light": "jasny",
    "theme.mode.dark": "ciemny",

    "chat.sidebar.title": "Historia czatów",
    "chat.sidebar.new": "Nowy",
    "chat.sidebar.empty": "Brak czatów. Utwórz nowy.",

    "chat.header.title": "Panel",
    "chat.header.logout": "Wyloguj",
    "chat.pane.select_chat": "Wybierz czat",
    "chat.pane.model": "Model",
    "chat.pane.start": "Rozpocznij rozmowę. Napisz poniżej.",
    "chat.pane.you": "Ty",
    "chat.pane.assistant": "Asystent",
    "chat.pane.placeholder": "Napisz wiadomość...",

    "chat.new_title": "Nowy czat",

    "auth.login.title": "Witamy ponownie",
    "auth.register.title": "Utwórz konto",
    "auth.email": "Email",
    "auth.password": "Hasło",
    "auth.name": "Imię",
    "auth.signin": "Zaloguj się",
    "auth.signup": "Zarejestruj się",
    "auth.no_account": "Nie masz konta?",
    "auth.have_account": "Masz już konto?",
    "auth.forgot": "Zapomniałeś hasła",
  },
};

export type Messages = typeof messages;
