import { useCallback } from "react";
import { useLanguage } from "./useLanguage";
import { getTranslation } from "../i18n/translations";

export const useTranslation = () => {
  const { language } = useLanguage();

  const t = useCallback((key) => getTranslation(language, key), [language]);

  return { t, language };
};
