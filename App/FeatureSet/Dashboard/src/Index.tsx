import App from "./App";
import "./Utils/i18n";
import "Common/UI/Styles/Theme.css";
import Telemetry from "Common/UI/Utils/Telemetry/Telemetry";
import ProjectUtil from "Common/UI/Utils/Project";
import ThemeUtil from "Common/UI/Utils/Theme";
import UserUtil from "Common/UI/Utils/User";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CAST_OPERATIONS_EMBEDDED_MODE } from "Common/UI/Config";
import {
  bootstrapCastConsoleIdentity,
  getTrustedCastParentOrigin,
} from "./Utils/CastConsoleIdentityBootstrap";

ThemeUtil.initialize();

if (CAST_OPERATIONS_EMBEDDED_MODE) {
  document.documentElement.classList.add("cast-operations-embedded");

  const castThemeProperties: Record<string, string> = {
    fontFamily: "--cast-font-family",
    codeFontFamily: "--cast-code-font-family",
    fontSize: "--cast-font-size-base",
    backgroundPrimary: "--cast-background-primary",
    backgroundSecondary: "--cast-background-secondary",
    backgroundTertiary: "--cast-background-tertiary",
    backgroundQuaternary: "--cast-background-quaternary",
    borderLight: "--cast-border-light",
    borderMedium: "--cast-border-medium",
    borderStrong: "--cast-border-strong",
    radiusSmall: "--cast-radius-small",
    radiusMedium: "--cast-radius-medium",
    radiusLarge: "--cast-radius-large",
    textPrimary: "--cast-text-primary",
    textSecondary: "--cast-text-secondary",
    textTertiary: "--cast-text-tertiary",
    textMuted: "--cast-text-muted",
    brandPrimary: "--cast-brand-primary",
    brandSoft: "--cast-brand-soft",
  };

  const castParentOrigin: string | null = getTrustedCastParentOrigin();

  window.addEventListener("message", (event: MessageEvent): void => {
    if (
      castParentOrigin === null ||
      event.source !== window.parent ||
      event.origin !== castParentOrigin
    ) {
      return;
    }

    if (event.data?.type === "CAST_OPERATIONS_NAVIGATE_BACK") {
      const historyIndex: unknown = window.history.state?.idx;

      if (typeof historyIndex === "number" && historyIndex > 0) {
        window.history.back();
      } else {
        window.parent.postMessage(
          { type: "CAST_OPERATIONS_BACK_UNAVAILABLE" },
          castParentOrigin,
        );
      }
      return;
    }

    if (
      event.data?.type !== "CAST_COLOR_SCHEME" ||
      !["light", "dark"].includes(event.data?.colorScheme)
    ) {
      return;
    }

    const useDarkTheme: boolean = event.data.colorScheme === "dark";
    document.documentElement.classList.toggle("dark", useDarkTheme);
    document.documentElement.classList.toggle("light", !useDarkTheme);

    if (event.data.theme && typeof event.data.theme === "object") {
      for (const [themeKey, cssProperty] of Object.entries(
        castThemeProperties,
      )) {
        const value: unknown = event.data.theme[themeKey];

        if (
          typeof value === "string" &&
          value.length > 0 &&
          value.length < 256
        ) {
          document.documentElement.style.setProperty(cssProperty, value);
        }
      }
    }
  });
}

Telemetry.init({
  serviceName: "dashboard",
});

/*
 * Seed RUM context so browser spans carry the signed-in user and the project
 * being viewed. Project context is kept fresh on switch via
 * ProjectUtil.setCurrentProject.
 */
Telemetry.setGlobalAttributes({
  ...(UserUtil.isLoggedIn() ? { userId: UserUtil.getUserId().toString() } : {}),
  ...(ProjectUtil.getCurrentProjectId()
    ? { projectId: ProjectUtil.getCurrentProjectId()!.toString() }
    : {}),
});

const root: any = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

const renderApp: () => void = (): void => {
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
};

const start: () => Promise<void> = async (): Promise<void> => {
  if (CAST_OPERATIONS_EMBEDDED_MODE) {
    const parentOrigin: string | null = getTrustedCastParentOrigin();
    if (!parentOrigin) {
      throw new Error(
        "Cast Operations embed has no trusted Cast parent origin",
      );
    }
    await bootstrapCastConsoleIdentity(parentOrigin);
  }
  renderApp();
};

void start().catch((error: unknown) => {
  const message: string =
    error instanceof Error
      ? error.message
      : "Cast identity initialization failed";
  root.render(
    <main className="min-h-screen flex items-center justify-center p-8">
      <section role="alert" className="max-w-lg text-center">
        <h1 className="text-xl font-semibold">
          Unable to open Cast Operations
        </h1>
        <p className="mt-3 text-sm text-gray-500">{message}</p>
      </section>
    </main>,
  );
});
