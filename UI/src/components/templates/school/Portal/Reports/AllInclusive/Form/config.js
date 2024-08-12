import DatePicker from "../../../../../../molecules/Controllers/DatePicker/Placeholder-label";
import Select from "../../../../../../molecules/Controllers/Select/Placeholder-label";

export const initForm = () => {
  return {
    startDate: { value: null, message: "" },
    endDate: { value: "", message: "" },
    searchBy: { value: "", message: "" },
    quickLinks: { value: "", message: "" },
  };
};

export const renderFields = (form) => [
  {
    value: form.startDate.value,
    message: form.startDate.message,
    name: "startDate",
    label: "Start Date",
    component: DatePicker,
  },
  {
    value: form.endDate.value,
    message: form.endDate.message,
    name: "endDate",
    label: "End Date",
    component: DatePicker,
  },
  {
    value: form.searchBy.value,
    message: form.searchBy.message,
    name: "searchBy",
    label: "Application ID",
    options: [],
    component: Select,
  },
  {
    value: form.quickLinks.value,
    message: form.quickLinks.message,
    name: "quickLinks",
    label: "Quick Links",
    options: [],
    component: Select,
  },
];
