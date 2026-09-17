"use client";

import React, { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";
import BodyScrollLock from "@/components/common/BodyScrollLock";
import ThemeProvider from "@/components/common/ThemeProvider";
import { FileProvider } from "@/context/FileContext";
import GlobalActionTooltip from "@/components/common/GlobalActionTooltip";
import { seedDummyProjectData } from "@/utils/localStore";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    seedDummyProjectData();
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <FileProvider>
      <ThemeProvider>
        <BodyScrollLock />
        <GlobalActionTooltip />
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : children}
        </div>
      </ThemeProvider>
    </FileProvider>
  );
}
