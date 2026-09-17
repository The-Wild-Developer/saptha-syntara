"use client";

import useColorMode from "@/hooks/useColorMode";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useColorMode();

  return <>{children}</>;
}
