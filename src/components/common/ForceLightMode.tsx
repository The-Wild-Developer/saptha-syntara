"use client";

import { useLayoutEffect } from "react";
import { applyColorMode, getStoredColorMode } from "@/utils/theme";

export default function ForceLightMode({
  children,
}: {
  children: React.ReactNode;
}) {
  useLayoutEffect(() => {
    applyColorMode("light");

    return () => {
      applyColorMode(getStoredColorMode());
    };
  }, []);

  return <>{children}</>;
}
