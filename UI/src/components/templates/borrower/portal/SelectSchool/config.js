import { requiredFieldLabel } from "../../../../molecules/Controllers/Elements/FieldLabel";
import TextField from "../../../../molecules/Controllers/TextField/Placeholder-label";
import FormattedField from "../../../../molecules/Controllers/FormattedField/Placeholder-label";
import DatePicker from "../../../../molecules/Controllers/DatePicker/Placeholder-label";
import Select from "../../../../molecules/Controllers/Select/Placeholder-label";
import { states, terms } from "../../../../../utils/selectsOptions";

export const initForm = () => {
  return {
    schoolState: { value: states[0].value, message: "", required: true },
    date: { value: "", message: "", required: false },
    schoolName: { value: "", message: "", required: true },
    program: { value: "", message: "", required: true },
    amountRequested: { value: "", message: "", required: true },
    term: { value: terms[0].value, message: "", required: true },
  };
};

export const renderFields = (form) => [
  {
    value: form.schoolState.value,
    message: form.schoolState.message,
    name: "schoolState",
    label: requiredFieldLabel("School State"),
    component: Select,
    options: states,
  },
  {
    value: form.date.value,
    message: form.date.message,
    name: "date",
    label: "Anticipated Graduation Date",
    component: DatePicker,
  },
  {
    value: form.schoolName.value,
    message: form.schoolName.message,
    name: "schoolName",
    label: requiredFieldLabel("School Name"),
    component: TextField,
  },
  {
    value: form.program.value,
    message: form.program.message,
    name: "program",
    label: requiredFieldLabel("Academic Program"),
    component: TextField,
  },
  {
    value: form.amountRequested.value,
    message: form.amountRequested.message,
    name: "amountRequested",
    label: requiredFieldLabel("Amount Requested (whole dollars only)"),
    component: FormattedField,
  },
  {
    value: form.term.value,
    message: form.term.message,
    name: "term",
    label: requiredFieldLabel("Installment Term"),
    component: Select,
    options: terms,
  },
];
