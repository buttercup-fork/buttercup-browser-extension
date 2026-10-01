import { TITLE as WelcomeTitle, Page as WelcomePage } from "./pages/Welcome.jsx";

export const NOTIFICATIONS: Record<string, [string, () => JSX.Element]> = {
    "2026-10-welcome-codekunde": [WelcomeTitle, WelcomePage]
};

export const NOTIFICATION_NAMES = Object.keys(NOTIFICATIONS);
