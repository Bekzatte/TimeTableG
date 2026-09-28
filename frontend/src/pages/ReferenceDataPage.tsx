import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../api/queryKeys";
import { DataTable } from "../components/ui/DataTable";
import Form from "../components/ui/Form";
import Modal from "../components/ui/Modal";
import { useTranslation } from "../hooks/useTranslation";
import { useServerMutation, useServerQuery } from "../hooks/useServerData";
import { referenceDataAPI } from "../services/api";

const DATASETS = [
  {
    key: "faculties",
    titleKey: "referenceFaculties",
    valueSource: "label_ru",
    fields: [
      { name: "value", labelKey: "referenceValue", required: true, visible: false },
      { name: "label_ru", labelKey: "referenceLabelRu", required: true },
      { name: "label_kk", labelKey: "referenceLabelKk" },
      { name: "label_en", labelKey: "referenceLabelEn" },
      { name: "sort_order", labelKey: "referenceSortOrder", type: "number", visible: false },
      { name: "is_active", labelKey: "referenceActive", type: "toggle" },
    ],
  },
  {
    key: "study-languages",
    titleKey: "referenceStudyLanguages",
    valueSource: "label_key",
    fields: [
      { name: "value", labelKey: "referenceValue", required: true, visible: false },
      { name: "label_key", labelKey: "referenceLabelKey", required: true },
      { name: "sort_order", labelKey: "referenceSortOrder", type: "number", visible: false },
      { name: "is_active", labelKey: "referenceActive", type: "toggle" },
    ],
  },
  {
    key: "education-groups",
    titleKey: "referenceEducationGroups",
    fields: [
      { name: "code", labelKey: "referenceCode", required: true },
      { name: "label_ru", labelKey: "referenceLabelRu", required: true },
      { name: "label_kk", labelKey: "referenceLabelKk" },
      { name: "label_en", labelKey: "referenceLabelEn" },
      { name: "sort_order", labelKey: "referenceSortOrder", type: "number", visible: false },
      { name: "is_active", labelKey: "referenceActive", type: "toggle" },
    ],
  },
  {
    key: "programmes",
    titleKey: "referenceProgrammes",
    fields: [
      { name: "code", labelKey: "referenceCode", required: true },
      {
        name: "education_group_code",
        labelKey: "referenceEducationGroupCode",
        required: true,
      },
      { name: "label_ru", labelKey: "referenceLabelRu", required: true },
      { name: "label_kk", labelKey: "referenceLabelKk" },
      { name: "label_en", labelKey: "referenceLabelEn" },
      { name: "sort_order", labelKey: "referenceSortOrder", type: "number", visible: false },
      { name: "is_active", labelKey: "referenceActive", type: "toggle" },
    ],
  },
  {
    key: "room-programmes",
    titleKey: "referenceRoomProgrammes",
    valueSource: "label_ru",
    fields: [
      { name: "value", labelKey: "referenceValue", required: true, visible: false },
      { name: "label_ru", labelKey: "referenceLabelRu", required: true },
      { name: "label_kk", labelKey: "referenceLabelKk" },
      { name: "label_en", labelKey: "referenceLabelEn" },
      { name: "sort_order", labelKey: "referenceSortOrder", type: "number", visible: false },
      { name: "is_active", labelKey: "referenceActive", type: "toggle" },
    ],
  },
];

const normalizeInitialValues = (item, fields) => {
  const values = { is_active: 1, sort_order: 0 };
  fields.forEach((field) => {
    if (item && item[field.name] !== undefined && item[field.name] !== null) {
      values[field.name] = item[field.name];
    }
  });
  return values;
};

export default function ReferenceDataPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeDatasetKey, setActiveDatasetKey] = useState(DATASETS[0].key);
  const [editingItem, setEditingItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("active");
  const [programmeGroupFilter, setProgrammeGroupFilter] = useState("");
  const activeDataset = DATASETS.find((dataset) => dataset.key === activeDatasetKey) || DATASETS[0];

  const datasetQuery = useServerQuery(
    queryKeys.referenceData.dataset(activeDataset.key),
    () => referenceDataAPI.listDataset(activeDataset.key),
    { keepPreviousData: true },
  );

  const invalidateReferences = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.referenceData.dataset(activeDataset.key) }),
      queryClient.invalidateQueries({ queryKey: queryKeys.referenceData.all }),
    ]);
  };

  const createMutation = useServerMutation(
    (payload) => referenceDataAPI.createDatasetItem(activeDataset.key, payload),
    { onSuccess: invalidateReferences },
  );
  const updateMutation = useServerMutation(
    (payload) => referenceDataAPI.updateDatasetItem(activeDataset.key, editingItem.id, payload),
    { onSuccess: invalidateReferences },
  );
  const deleteMutation = useServerMutation(
    (item) => referenceDataAPI.deleteDatasetItem(activeDataset.key, item.id),
    { onSuccess: invalidateReferences },
  );

  const columns = useMemo(
    () => [
      ...activeDataset.fields.filter((field) => field.visible !== false).map((field) => ({
        key: field.name,
        label: t(field.labelKey),
        render:
          field.name === "is_active"
            ? (value) => (value ? t("yes") : t("no"))
            : undefined,
      })),
    ],
    [activeDataset.fields, t],
  );

  const rows = useMemo(() => datasetQuery.data || [], [datasetQuery.data]);
  const programmeGroupOptions = useMemo(() => {
    const values = new Set();
    rows.forEach((item) => {
      if (item.education_group_code) {
        values.add(item.education_group_code);
      }
    });
    return Array.from(values).sort();
  }, [rows]);
  const filteredRows = useMemo(
    () =>
      rows.filter((item) => {
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && item.is_active) ||
          (statusFilter === "inactive" && !item.is_active);
        const matchesProgrammeGroup =
          activeDataset.key !== "programmes" ||
          !programmeGroupFilter ||
          item.education_group_code === programmeGroupFilter;
        return matchesStatus && matchesProgrammeGroup;
      }),
    [activeDataset.key, programmeGroupFilter, rows, statusFilter],
  );

  const formFields = activeDataset.fields
    .filter((field) => field.visible !== false)
    .map((field) => ({
      name: field.name,
      label: t(field.labelKey),
      type: field.type || "text",
      required: field.required,
    }));

  const filterControls = (
    <>
      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
        className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
      >
        <option value="active">{t("referenceFilterActive")}</option>
        <option value="inactive">{t("referenceFilterInactive")}</option>
        <option value="all">{t("referenceFilterAll")}</option>
      </select>
      {activeDataset.key === "programmes" ? (
        <select
          value={programmeGroupFilter}
          onChange={(event) => setProgrammeGroupFilter(event.target.value)}
          className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
        >
          <option value="">{t("referenceAllEducationGroups")}</option>
          {programmeGroupOptions.map((code: string) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      ) : null}
    </>
  );

  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = async (formData, setErrors) => {
    const mutation = editingItem ? updateMutation : createMutation;
    const payload = {
      ...normalizeInitialValues(editingItem, activeDataset.fields),
      ...formData,
    };
    if (!payload.value && activeDataset.valueSource) {
      payload.value = payload[activeDataset.valueSource];
    }
    try {
      await mutation.mutateAsync(payload);
      closeModal();
    } catch (error) {
      setErrors({ error: error.message || t("errorUnknown") });
    }
  };

  const handleDeactivate = async (item) => {
    await deleteMutation.mutateAsync(item);
  };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:py-8 xl:px-10">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("referenceData")}
          </h1>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#014531] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#013726]"
        >
          <Plus size={18} />
          {t("add")}
        </button>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {DATASETS.map((dataset) => {
          const isActive = dataset.key === activeDataset.key;
          return (
            <button
              key={dataset.key}
              type="button"
              onClick={() => {
                setActiveDatasetKey(dataset.key);
                setStatusFilter("active");
                setProgrammeGroupFilter("");
                closeModal();
              }}
              className={`whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-[#014531] bg-[#014531] text-white"
                  : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {t(dataset.titleKey)}
            </button>
          );
        })}
      </div>

      <DataTable
        columns={columns}
        data={filteredRows}
        isLoading={datasetQuery.isLoading}
        enableSearch
        filterControls={filterControls}
        hasActiveFilters={statusFilter !== "active" || Boolean(programmeGroupFilter)}
        onResetFilters={() => {
          setStatusFilter("active");
          setProgrammeGroupFilter("");
        }}
        onEdit={openEditModal}
        onDelete={handleDeactivate}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingItem ? t("referenceEditItem") : t("referenceAddItem")}
        size="md"
      >
        <Form
          fields={formFields}
          initialValues={normalizeInitialValues(editingItem, activeDataset.fields)}
          resetKey={`${activeDataset.key}-${editingItem?.id || "new"}`}
          onSubmit={handleSubmit}
          submitText={t("save")}
          isLoading={createMutation.isPending || updateMutation.isPending}
          showLoadingText
        />
      </Modal>
    </div>
  );
}
