import { referenceDataAPI } from "../services/api";
import { useServerQuery } from "../hooks/useServerData";
import { queryKeys } from "./queryKeys";

export const REFERENCE_DATA_FALLBACK = {
  faculties: [],
  studyLanguages: [],
  educationGroups: [],
  educationGroupLabels: {},
  programmeLabels: {},
  roomProgrammes: [],
};

export const useReferenceDataQuery = () =>
  useServerQuery(queryKeys.referenceData.all, referenceDataAPI.getAll, {
    staleTime: 5 * 60 * 1000,
  });

export const useReferenceData = () => {
  const query = useReferenceDataQuery();
  return {
    ...query,
    data: {
      ...REFERENCE_DATA_FALLBACK,
      ...((query.data || {}) as Record<string, unknown>),
    },
  };
};
