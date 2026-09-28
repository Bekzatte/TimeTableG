export const getFacultyLabel = (value, language = "ru", faculties = []) => {
  const faculty = faculties.find((item) => item.value === value);
  if (!faculty) {
    return value || "-";
  }
  return faculty.labels?.[language] || faculty.labels?.ru || faculty.value;
};

export const getProgrammeLabel = (programme, language = "ru") =>
  programme.labels?.[language] || programme.labels?.ru || programme.labels?.en;

export const getCanonicalProgrammeName = (programme) =>
  (programme.labels?.ru || programme.labels?.en || "").replace(/\s*\([^)]*\)\s*$/, "");

export const getProgrammeLabelByValue = (value, language = "ru", programmes = []) => {
  const programme = programmes.find(
    (item) => getCanonicalProgrammeName(item) === value || item.value === value,
  );
  if (!programme) {
    return value || "-";
  }
  return getProgrammeLabel(programme, language);
};

const localizedLabel = (fallback, translations, language = "ru") =>
  language === "ru" ? fallback : translations?.[language] || fallback;

const normalizeLabel = (value) => String(value || "").trim().toLowerCase();

export const getEducationGroupLabel = (
  value,
  language = "ru",
  educationGroups = [],
  educationGroupLabels = {},
) => {
  const educationGroupByValue = Object.fromEntries(
    educationGroups.map((group) => [group.value, group]),
  );
  const normalizedValue = String(value || "").trim().toLowerCase();
  if (educationGroupByValue[normalizedValue]) {
    const group = educationGroupByValue[normalizedValue];
    return localizedLabel(group.label, educationGroupLabels[normalizedValue], language);
  }
  const match = normalizedValue.match(/\bb(\d{3})\b/);
  if (match) {
    const groupValue = `b${match[1]}`;
    if (educationGroupByValue[groupValue]) {
      const group = educationGroupByValue[groupValue];
      return localizedLabel(group.label, educationGroupLabels[groupValue], language);
    }
  }
  return value || "";
};

export const getEducationGroupValue = (value, educationGroups = []) => {
  const educationGroupByValue = Object.fromEntries(
    educationGroups.map((group) => [group.value, group]),
  );
  const normalizedValue = String(value || "").trim().toLowerCase();
  if (educationGroupByValue[normalizedValue]) {
    return normalizedValue;
  }
  const match = normalizedValue.match(/\bb(\d{3})\b/);
  if (match) {
    const groupValue = `b${match[1]}`;
    if (educationGroupByValue[groupValue]) {
      return groupValue;
    }
  }
  return value || "";
};

export const getSpecialtyLabel = (
  code,
  language = "ru",
  educationGroups = [],
  programmeLabels = {},
) => {
  const programmeCodeToLabel = Object.fromEntries(
    educationGroups.flatMap((group) =>
      (group.programmes || []).map((programme) => [programme.code, programme.label]),
    ),
  );
  const programmeLabelToCode = Object.fromEntries(
    Object.entries(programmeCodeToLabel).flatMap(([programmeCode, label]) => {
      const translations = programmeLabels[programmeCode] || {};
      return [
        [normalizeLabel(programmeCode), programmeCode],
        [normalizeLabel(label), programmeCode],
        [normalizeLabel(translations.kk), programmeCode],
        [normalizeLabel(translations.en), programmeCode],
      ].filter(([key]) => key);
    }),
  );
  const normalizedCode = programmeLabelToCode[normalizeLabel(code)] || code;
  return localizedLabel(
    programmeCodeToLabel[normalizedCode] || code || "",
    programmeLabels[normalizedCode],
    language,
  );
};

export const getProgrammeOptionsByEducationGroup = (
  groupValue,
  language = "ru",
  educationGroups = [],
  programmeLabels = {},
) => {
  const educationGroupByValue = Object.fromEntries(
    educationGroups.map((group) => [group.value, group]),
  );
  return (educationGroupByValue[groupValue]?.programmes || []).map((programme) => ({
    value: programme.code,
    label: getSpecialtyLabel(programme.code, language, educationGroups, programmeLabels),
  }));
};

export const getProgrammeCodeToEducationGroup = (educationGroups = []) =>
  Object.fromEntries(
    educationGroups.flatMap((group) =>
      (group.programmes || []).map((programme) => [programme.code, group.value]),
    ),
  );
