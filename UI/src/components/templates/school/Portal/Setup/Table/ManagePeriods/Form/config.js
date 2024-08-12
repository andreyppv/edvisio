import TextField from "../../../../../../../molecules/Controllers/TextField/Placeholder-label";
import FormattedField from "../../../../../../../molecules/Controllers/FormattedField/Placeholder-label";
import DatePicker from "../../../../../../../molecules/Controllers/DatePicker/Placeholder-label";
import Checkbox from "../../../../../../../molecules/Controllers/CheckBox/Custom";

export const initForm = ({
  name = "",
  description = "",
  startDate = "",
  endDate = "",
  order = 0,
  active = false,
}) => {
  return {
    name: { value: name || "", message: "", required: true },
    description: { value: description || "", message: "", required: true },
    startDate: { value: startDate || "", message: "", required: false },
    endDate: { value: endDate || "", message: "", required: false },
    order: { value: order || "", message: "", required: true },
    active: {
      value: active,
      message: "",
      required: true,
    },
  };
};

export const renderFields = (form) => [
  {
    value: form?.firstName?.value,
    message: form?.firstName?.message,
    name: "firstName",
    component: TextField,
    label: "Name",
  },
  {
    value: form?.description?.value,
    message: form?.description?.message,
    name: "description",
    component: TextField,
    label: "Description",
  },
  {
    value: form?.startDate?.value,
    message: form?.startDate?.message,
    name: "startDate",
    component: DatePicker,
    label: "Period Start Date",
  },
  {
    value: form?.endDate?.value,
    message: form?.endDate?.message,
    name: "endDate",
    component: DatePicker,
    label: "Period End Date",
  },
  {
    value: form?.order?.value,
    message: form?.order?.message,
    name: "order",
    component: FormattedField,
    label: "Sort Order",
  },
  {
    value: form?.active?.value,
    message: form?.active?.message,
    name: "active",
    component: Checkbox,
    label: "Active",
  },
];
