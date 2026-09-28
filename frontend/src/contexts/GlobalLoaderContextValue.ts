import { createContext } from "react";

export type GlobalLoaderOptions = {
  title?: string;
  description?: string;
  variant?: string;
};

export type GlobalLoaderContextValue = {
  activeLoader: (Required<GlobalLoaderOptions> & { variant: string }) | null;
  isBlocking: boolean;
  showLoader: (options?: GlobalLoaderOptions) => () => void;
  withGlobalLoader: <T>(
    task: () => Promise<T> | T,
    options?: GlobalLoaderOptions,
  ) => Promise<T>;
};

export const GlobalLoaderContext = createContext<GlobalLoaderContextValue>({
  activeLoader: null,
  isBlocking: false,
  showLoader: () => () => {},
  withGlobalLoader: async (task) => task(),
});
