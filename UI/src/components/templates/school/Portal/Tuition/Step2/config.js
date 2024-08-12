import React from "react";
import TextField from "../../../../../molecules/Controllers/TextField/Placeholder-label";
import FormattedField from "../../../../../molecules/Controllers/FormattedField/Placeholder-label";
import Select from "../../../../../molecules/Controllers/Select/Placeholder-label";
import { states } from "../../../../../../utils/selectsOptions";

export const initMailingAddressForm = () => {
  return {
    address: { value: "", message: "", required: true },
    address2: { value: "", message: "", required: true },
    city: { value: "", message: "", required: true },
    state: { value: "", message: "", required: false },
    zip: { value: "", message: "", required: true },
    phone: { value: "", message: "", required: true },
    phone2: { value: "", message: "", required: true },
  };
};

export const initPermanentAddress = () => {
  return {
    address: { value: "", message: "", required: true },
    address2: { value: "", message: "", required: true },
    city: { value: "", message: "", required: true },
    state: { value: "", message: "", required: true },
    zip: { value: "", message: "", required: true },
  };
};

const requiredFieldLabel = (text) => {
  return (
    <>
      {text}
      <span style={{ color: "red" }}>*</span>
    </>
  );
};

export const mailingAddress = (form) => [
  {
    value: form.address.value,
    message: form.address.message,
    name: "address",
    label: requiredFieldLabel("Address"),
    component: TextField,
  },
  {
    value: form.address2.value,
    message: form.address2.message,
    name: "address2",
    label: requiredFieldLabel("Address 2"),
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
    label: "Zip Code",
    format: "#####",
    placeholder: requiredFieldLabel("Zip"),
    message: form.zip.message,
  },
  {
    value: form?.phone?.value,
    name: "phone",
    placeholder: "+1 (***) *** ****",
    message: form?.phone?.message || "",
    component: FormattedField,
    valid: form?.phone?.valid || false,
    format: "+1 (###) ### ####",
    label: requiredFieldLabel("Phone number"),
    mask: "_",
  },
  {
    value: form?.phone2?.value,
    name: "phone2",
    placeholder: "+1 (***) *** ****",
    message: form?.phone2?.message || "",
    component: FormattedField,
    valid: form?.phone?.valid || false,
    format: "+1 (###) ### ####",
    label: "Alternate Phone number",
    mask: "_",
  },
];

export const permanentAddress = (form) => [
  {
    value: form.address.value,
    message: form.address.message,
    name: "address",
    label: requiredFieldLabel("Address"),
    component: TextField,
  },
  {
    value: form.address2.value,
    message: form.address2.message,
    name: "address2",
    label: requiredFieldLabel("Address 2"),
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
    label: "Zip Code",
    format: "#####",
    placeholder: requiredFieldLabel("Zip"),
    message: form.zip.message,
  },
];
