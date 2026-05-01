"use client";

import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "laburapp:theme";

const listeners = new Set<() => void>();

function subscribeTheme(callback: () => void) {
  listeners.add(callback);
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  const onMql = () => callback();
  mql.addEventListener("change", onMql);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    mql.removeEventListener("change", onMql);
    window.removeEventListener("storage", onStorage);
  };
}

function notifyThemeListeners() {
  listeners.forEach((l) => l());
}

/** Snapshot key: `{preference}:{0|1}` for system-dark match */
function getThemeSnapshot(): string {
  const preference =
    (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return `${preference}:${systemDark ? "1" : "0"}`;
}

function getServerThemeSnapshot(): string {
  return "system:0";
}

function persistThemePreference(next: Theme) {
  localStorage.setItem(STORAGE_KEY, next);
  notifyThemeListeners();
}

function parseThemeSnapshot(snap: string): { preference: Theme; systemDark: boolean } {
  const [pref, sd] = snap.split(":");
  return {
    preference: (pref as Theme) ?? "system",
    systemDark: sd === "1",
  };
}

function applyThemeResolved(resolved: "light" | "dark") {
  document.documentElement.classList.toggle("dark", resolved === "dark");
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snap = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);
  const { preference, systemDark } = parseThemeSnapshot(snap);
  const resolvedTheme: "light" | "dark" =
    preference === "system" ? (systemDark ? "dark" : "light") : preference;

  useLayoutEffect(() => {
    applyThemeResolved(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    persistThemePreference(next);
  }, []);

  const value = useMemo(
    () => ({
      theme: preference,
      resolvedTheme,
      setTheme,
    }),
    [preference, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
