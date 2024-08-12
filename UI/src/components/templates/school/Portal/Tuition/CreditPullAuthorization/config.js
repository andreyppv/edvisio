import TextField from "../../../../../molecules/Controllers/TextField/Placeholder-label";
import FormattedField from "../../../../../molecules/Controllers/FormattedField/Placeholder-label";
import DatePicker from "../../../../../molecules/Controllers/DatePicker/Placeholder-label";
import Select from "../../../../../molecules/Controllers/Select/Placeholder-label";
import { requiredFieldLabel } from "../../../../../molecules/Controllers/Elements/FieldLabel";
import { states } from "../../../../../../utils/selectsOptions";

export const initForm = () => {
  return {
    firstName: { value: "", message: "", required: true },
    middleName: { value: "", message: "", required: false },
    lastName: { value: "", message: "", required: true },
    ssn: { value: "", message: "", required: true },
    dob: { value: "", message: "", required: true },
    address: { value: "", message: "", required: true },
    city: { value: "", message: "", required: true },
    state: { value: "", message: "", required: true },
    zip: { value: "", message: "", required: true },
    schoolState: { value: "", message: "", required: true },
    schoolName: { value: "", message: "", required: true },
    academicYear: { value: "", message: "", required: false },
    coSigner: { value: false, message: "", required: false },
    approval: { value: false, message: "", required: false },
  };
};

export const applicationInformation = (form) => [
  {
    value: form.firstName.value,
    message: form.firstName.message,
    name: "firstName",
    label: requiredFieldLabel("First Name"),
    component: TextField,
  },
  {
    value: form.middleName.value,
    message: form.middleName.message,
    name: "middleName",
    label: "Middle Initial",
    component: TextField,
  },
  {
    value: form.lastName.value,
    message: form.lastName.message,
    name: "lastName",
    label: requiredFieldLabel("Last Name"),
    component: TextField,
  },
  {
    value: form.ssn.value,
    message: form.ssn.message,
    name: "ssn",
    format: "#####",
    label: requiredFieldLabel("Social Security Number"),
    component: FormattedField,
  },
  {
    value: form.dob.value,
    message: form.dob.message,
    name: "dob",
    label: requiredFieldLabel("Date of Birth"),
    component: DatePicker,
  },
];

export const address = (form) => [
  {
    value: form.address.value,
    message: form.address.message,
    name: "address",
    label: requiredFieldLabel("Address"),
    component: TextField,
  },
  {
    value: form.city.value,
    message: form.city.message,
    name: "city",
    label: requiredFieldLabel("City"),
    component: TextField,
  },
  {
    value: form.state.value,
    message: form.state.message,
    name: "state",
    label: requiredFieldLabel("State"),
    component: Select,
    options: states,
  },
  {
    value: form.zip.value,
    name: "zip",
    component: FormattedField,
    label: requiredFieldLabel("Zip"),
    format: "#####",
    message: form.zip.message,
  },
];

export const schoolInformation = (form) => [
  {
    value: form.schoolState.value,
    message: form.schoolState.message,
    label: requiredFieldLabel("School State"),
    name: "schoolState",
    component: Select,
    options: states,
  },
  {
    value: form.schoolName.value,
    message: form.schoolName.message,
    label: requiredFieldLabel("School Name"),
    name: "schoolName",
    component: Select,
    options: states,
  },
  {
    value: form.academicYear.value,
    message: form.academicYear.message,
    label: requiredFieldLabel("Academic School Year"),
    name: "academicYear",
    component: Select,
    options: states,
  },
];
