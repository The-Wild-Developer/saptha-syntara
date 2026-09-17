export const COLOR_THEME_KEY = "color-theme";

export type ColorMode = "light" | "dark";

export const getStoredColorMode = (): ColorMode => {
  if (typeof window === "undefined") {
    return "light";
  }

  try {
    const stored = window.localStorage.getItem(COLOR_THEME_KEY);
    return stored && JSON.parse(stored) === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

export const applyColorMode = (colorMode: ColorMode) => {
  if (typeof document === "undefined") {
    return;
  }

  const isDark = colorMode === "dark";
  document.documentElement.classList.toggle("dark", isDark);
  document.body.classList.toggle("dark", isDark);
  syncSwalTheme();
};

export const syncSwalTheme = () => {
  if (typeof document === "undefined") {
    return;
  }

  const isDark = document.documentElement.classList.contains("dark");

  document.querySelectorAll(".swal2-container").forEach((container) => {
    container.classList.toggle("swal-dark", isDark);
    container.classList.toggle("swal-light", !isDark);

    const popup = container.querySelector(".swal2-popup");
    if (popup) {
      popup.setAttribute("data-swal2-theme", isDark ? "dark" : "light");
    }
  });
};

export const isAuthRoute = (pathname: string) => pathname.includes("/auth/");

export const themeInitScript = `
(function () {
  try {
    if (window.location.pathname.indexOf("/auth/") !== -1) return;
    var theme = localStorage.getItem("${COLOR_THEME_KEY}");
    if (theme && JSON.parse(theme) === "dark") {
      document.documentElement.classList.add("dark");
      document.body.classList.add("dark");
    }
  } catch (e) {}
})();
`;
