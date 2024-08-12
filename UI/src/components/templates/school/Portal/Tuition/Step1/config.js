import TextField from "../../../../../molecules/Controllers/TextField/Placeholder-label";
import FormattedField from "../../../../../molecules/Controllers/FormattedField/Placeholder-label";
import DatePicker from "../../../../../molecules/Controllers/DatePicker/Placeholder-label";
import Select from "../../../../../molecules/Controllers/Select/Placeholder-label";
import { requiredFieldLabel } from "../../../../../molecules/Controllers/Elements/FieldLabel";
import { states } from "../../../../../../utils/selectsOptions";

export const initForm = () => {
  return {
    firstName: { value: "", message: "", required: true },
    middleName: { value: "", message: "", required: true },
    lastName: { value: "", message: "", required: true },
    ssn: { value: "", message: "", required: true },
    dob: { value: "", message: "", required: true },
    email: { value: "", message: "", required: true },
    licenseNumber: { value: "", message: "", required: true },
    licenseState: { value: "", message: "", required: true },
    studentId: { value: "", message: "", required: true },
    schoolState: { value: "", message: "", required: false },
    schoolName: { value: "", message: "", required: false },
    academicYear: { value: "", message: "", required: false },
  };
};

export const initFinancialAssistance = () => {
  return {
    cost: { value: "", message: "", required: true },
    assistance: { value: "", message: "", required: true },
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
    label: requiredFieldLabel("Middle Name"),
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
  {
    value: form.email.value,
    message: form.email.message,
    name: "email",
    label: requiredFieldLabel("Email Address"),
    component: TextField,
  },
  {
    value: form.licenseNumber.value,
    message: form.licenseNumber.message,
    name: "licenseNumber",
    label: "Driver's License Number",
    component: FormattedField,
  },
  {
    value: form.licenseState.value,
    message: form.licenseState.message,
    name: "licenseState",
    label: "Driver's License State",
    component: TextField,
  },
  {
    value: form.studentId.value,
    message: form.studentId.message,
    name: "studentId",
    label: "Student ID",
    component: FormattedField,
  },
];

export const financialAidInformation = (form) => [
  {
    value: form.cost.value,
    message: form.cost.message,
    label: requiredFieldLabel("Cost of Attendance"),
    name: "cost",
    component: FormattedField,
  },
  {
    value: form.assistance.value,
    message: form.assistance.message,
    label: requiredFieldLabel("Financial Assistance"),
    name: "assistance",
    component: FormattedField,
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
