import { useLayoutEffect } from "react";
import useLocalStorage from "./useLocalStorage";
import { applyColorMode, ColorMode, isAuthRoute } from "@/utils/theme";

const useColorMode = (): [ColorMode, (value: ColorMode | ((val: ColorMode) => ColorMode)) => void] => {
  const [colorMode, setColorMode] = useLocalStorage<ColorMode>("color-theme", "light");

  useLayoutEffect(() => {
    if (typeof window !== "undefined" && isAuthRoute(window.location.pathname)) {
      applyColorMode("light");
      return;
    }

    applyColorMode(colorMode);
  }, [colorMode]);

  return [colorMode, setColorMode];
};

export default useColorMode;
