import { useCallback, useMemo, useRef, useState } from "react";
import {
  GlobalLoaderContext,
  type GlobalLoaderOptions,
} from "./GlobalLoaderContextValue";

export const GlobalLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeLoader, setActiveLoader] = useState<{
    title: string;
    description: string;
    variant: string;
  } | null>(null);
  const pendingCountRef = useRef(0);

  const showLoader = useCallback((options: GlobalLoaderOptions = {}) => {
    pendingCountRef.current += 1;
    setActiveLoader({
      title: options.title || "",
      description: options.description || "",
      variant: options.variant || "default",
    });

    let closed = false;
    return () => {
      if (closed) {
        return;
      }

      closed = true;
      pendingCountRef.current = Math.max(0, pendingCountRef.current - 1);
      if (pendingCountRef.current === 0) {
        setActiveLoader(null);
      }
    };
  }, []);

  const withGlobalLoader = useCallback(
    async <T,>(task: () => Promise<T> | T, options: GlobalLoaderOptions = {}) => {
      const hideLoader = showLoader(options);
      try {
        return await task();
      } finally {
        hideLoader();
      }
    },
    [showLoader],
  );

  const value = useMemo(
    () => ({
      activeLoader,
      isBlocking: Boolean(activeLoader),
      showLoader,
      withGlobalLoader,
    }),
    [activeLoader, showLoader, withGlobalLoader],
  );

  return (
    <GlobalLoaderContext.Provider value={value}>
      {children}
    </GlobalLoaderContext.Provider>
  );
};
