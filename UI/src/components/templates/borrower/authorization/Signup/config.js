import EmailField from "../../../../molecules/Controllers/Email/EmailField";
import Password from "../../../../molecules/Controllers/Password/Placeholder-label";
import DatePicker from "../../../../molecules/Controllers/DatePicker/Placeholder-label";
import TextField from "../../../../molecules/Controllers/TextField/Placeholder-label";
import Select from "../../../../molecules/Controllers/Select/Placeholder-label";
import { requiredFieldLabel } from "../../../../molecules/Controllers/Elements/FieldLabel";
import { IdType } from "../../../../../utils/selectsOptions";

export const initForm = () => {
  return {
    firstName: { value: "", message: "", required: true },
    middleName: { value: "", message: "", required: false },
    lastName: { value: "", message: "", required: true },
    idType: { value: IdType[0].value, message: "", required: true },
    dob: { value: "", message: "", required: true },
    email: { value: "", message: "", required: true },
    password: { value: "", message: "", required: true },
    rePassword: { value: "", message: "", required: true },
  };
};

export const renderFields = (form) => [
  {
    value: form.firstName.value,
    message: form.firstName.message,
    name: "firstName",
    component: TextField,
    label: requiredFieldLabel("First Name"),
  },
  {
    value: form.middleName.value,
    message: form.middleName.message,
    name: "middleName",
    component: TextField,
    label: "Middle Name",
  },
  {
    value: form.lastName.value,
    message: form.lastName.message,
    name: "lastName",
    component: TextField,
    label: requiredFieldLabel("Last Name"),
  },
  {
    value: form.idType.value,
    message: form.idType.message,
    name: "idType",
    component: Select,
    options: IdType,
    label: requiredFieldLabel("ID Type"),
  },
  {
    value: form.dob.value,
    message: form.dob.message,
    name: "dob",
    component: DatePicker,
    label: requiredFieldLabel("Date of Birth"),
  },
  {
    value: form.email.value,
    message: form.email.message,
    name: "email",
    component: EmailField,
    label: requiredFieldLabel("Email Address"),
  },
  {
    value: form.password.value,
    message: form.password.message,
    name: "password",
    component: Password,
    label: requiredFieldLabel("Password"),
  },
  {
    value: form.rePassword.value,
    message: form.rePassword.message,
    name: "rePassword",
    component: Password,
    label: requiredFieldLabel("Password"),
  },
];
