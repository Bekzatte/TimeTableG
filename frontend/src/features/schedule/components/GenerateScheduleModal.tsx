import { useMemo, useState } from "react";
import Modal from "../../../components/ui/Modal";
import Form from "../../../components/ui/Form";

const ALGORITHM_INFO_KEYS = {
  greedy: "scheduleGenerationGreedyInfo",
  cpsat: "scheduleGenerationCpSatInfo",
  hybrid: "scheduleGenerationHybridInfo",
  cpsat_fast: "scheduleGenerationCpSatFastInfo",
};

export const GenerateScheduleModal = ({
  isOpen,
  isLoading,
  title,
  t,
  fields,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(
    initialValues?.algorithm || "cpsat",
  );

  const formFields = useMemo(
    () =>
      fields.map((field) => {
        if (field.name !== "algorithm") {
          return field;
        }

        return {
          ...field,
          onChange: (value, next, prev) => {
            setSelectedAlgorithm(value || initialValues?.algorithm || "cpsat");
            return field.onChange ? field.onChange(value, next, prev) : {};
          },
        };
      }),
    [fields, initialValues?.algorithm],
  );

  const selectedInfoKey =
    ALGORITHM_INFO_KEYS[selectedAlgorithm] || ALGORITHM_INFO_KEYS.cpsat;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (!isLoading) {
          onClose();
        }
      }}
      title={title}
      size="md"
    >
      <div className="mb-4 rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
        <h3 className="font-semibold text-emerald-950">
          {t("scheduleGenerationInfoTitle")}
        </h3>
        <p className="mt-2">{t("scheduleGenerationInfoIntro")}</p>
        <p className="mt-3">{t(selectedInfoKey)}</p>
      </div>

      <Form
        fields={formFields}
        onSubmit={onSubmit}
        resetKey="schedule-generate"
        submitText={t("generateSchedule")}
        isLoading={isLoading}
        initialValues={initialValues}
      />
    </Modal>
  );
};
