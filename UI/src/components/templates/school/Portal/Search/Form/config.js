import TextField from "../../../../../molecules/Controllers/TextField/Placeholder-label";
import FormattedField from "../../../../../molecules/Controllers/FormattedField/Placeholder-label";

export const initForm = () => {
  return {
    studentId: { value: "", message: "" },
    email: { value: "", message: "" },
    applicationId: { value: "", message: "" },
    firstName: { value: "", message: "" },
    lastName: { value: "", message: "" },
    ssn: { value: "", message: "" },
    alternateIdType: { value: "", message: "" },
    alternateIdNumber: { value: "", message: "" },
    phoneNumber: { value: "", message: "" },
  };
};

export const renderFields = (form) => [
  {
    value: form.studentId.value,
    message: form.studentId.message,
    name: "studentId",
    label: "Student ID",
    component: FormattedField,
  },
  {
    value: form.email.value,
    message: form.email.message,
    name: "email",
    label: "Email Address",
    component: TextField,
  },
  {
    value: form.applicationId.value,
    message: form.applicationId.message,
    name: "applicationId",
    label: "Application ID",
    component: FormattedField,
  },
  {
    value: form.firstName.value,
    message: form.firstName.message,
    name: "firstName",
    label: "First Name",
    component: TextField,
  },
  {
    value: form.lastName.value,
    message: form.lastName.message,
    name: "lastName",
    label: "Last Name",
    component: TextField,
  },
  {
    value: form.ssn.value,
    message: form.ssn.message,
    name: "ssn",
    label: "SSN",
    component: FormattedField,
  },
  {
    value: form.alternateIdType.value,
    message: form.alternateIdType.message,
    name: "alternateIdType",
    label: "Alternate ID Type",
    component: FormattedField,
  },
  {
    value: form.alternateIdNumber.value,
    message: form.alternateIdNumber.message,
    name: "alternateIdNumber",
    label: "Alternate ID Number",
    component: FormattedField,
  },
  {
    value: form.phoneNumber.value,
    message: form.phoneNumber.message,
    name: "phoneNumber",
    label: "Phone Number",
    mask: "_",
    format: "+1 (###) ### ####",
    component: FormattedField,
  },
];
