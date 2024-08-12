import TextField from "../../../../../../../molecules/Controllers/TextField/Placeholder-label";
import Select from "../../../../../../../molecules/Controllers/Select/Placeholder-label";
import Password from "../../../../../../../molecules/Controllers/Password/Placeholder-label";
import {
  status as statusOptions,
  roles as rolesOptions,
} from "../../../../../../../../utils/selectsOptions";

export const initForm = ({
  lastName = "",
  firstName = "",
  middleName = "",
  salutation = "",
  email = "",
  status = "",
  role = "",
  userName = "",
  ed2go = false,
}) => {
  return {
    lastName: { value: lastName || "", message: "", required: true },
    firstName: { value: firstName || "", message: "", required: true },
    middleName: { value: middleName || "", message: "", required: false },
    salutation: { value: salutation || "", message: "", required: false },
    email: { value: email || "", message: "", required: true },
    status: {
      value: status || statusOptions[0].value,
      message: "",
      required: true,
    },
    role: { value: role || rolesOptions[0].value, message: "", required: true },
    userName: { value: userName || "", message: "", required: true },
    ed2go: { value: ed2go, message: "", required: false },
    password: { value: "", message: "", required: true },
    rePassword: { value: "", message: "", required: true },
  };
};

export const renderFields = (form) => [
  {
    value: form?.firstName?.value,
    message: form?.firstName?.message,
    name: "firstName",
    component: TextField,
    label: "First Name",
  },
  {
    value: form?.middleName?.value,
    message: form?.middleName?.message,
    name: "middleName",
    component: TextField,
    label: "Middle Name",
  },
  {
    value: form?.lastName?.value,
    message: form?.lastName?.message,
    name: "lastName",
    component: TextField,
    label: "Last Name",
  },
  {
    value: form?.salutation?.value,
    message: form?.salutation?.message,
    name: "salutation",
    component: TextField,
    label: "Salutation",
  },
  {
    value: form?.email?.value,
    message: form?.email?.message,
    name: "email",
    component: TextField,
    label: "Email Address",
  },
  {
    value: form?.status?.value,
    message: form?.status?.message,
    name: "status",
    component: Select,
    options: statusOptions,
    label: "Status",
  },
  {
    value: form?.userName?.value,
    message: form?.userName?.message,
    name: "userName",
    component: TextField,
    label: "User Name",
  },
  {
    value: form?.role?.value,
    message: form?.role?.message,
    name: "role",
    component: Select,
    options: rolesOptions,
    label: "Role",
  },
];

export const renderPasswordFields = (form) => [
  {
    value: form?.password?.value,
    message: form?.password?.message,
    name: "password",
    component: Password,
    label: "Password",
  },
  {
    value: form?.rePassword?.value,
    message: form?.rePassword?.message,
    name: "rePassword",
    component: Password,
    label: "Password",
  },
];
