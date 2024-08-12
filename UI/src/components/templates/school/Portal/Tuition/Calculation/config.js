import FormattedField from "../../../../../molecules/Controllers/FormattedField/Placeholder-label";
import DatePicker from "../../../../../molecules/Controllers/DatePicker/Placeholder-label";
import { requiredFieldLabel } from "../../../../../molecules/Controllers/Elements/FieldLabel";

export const repaymentCalculatorFormInit = () => {
  return {
    requestedAmount: { value: "", message: "", required: true },
    repayment: { value: "", message: "", required: true },
    graduationDate: { value: "", message: "", required: true },
    releaseToServicing: { value: "", message: "", required: true },
  };
};

export const repaymentTermsFormInit = () => {
  return {
    apr: { value: "", message: "", required: false },
    interestRate: { value: "", message: "", required: false },
    inSchoolPayment: { value: "", message: "", required: false },
    afterSchoolPayment: { value: "", message: "", required: false },
  };
};

export const repaymentInformation = (form) => [
  {
    value: form.requestedAmount.value,
    message: form.requestedAmount.message,
    name: "requestedAmount",
    label: requiredFieldLabel("Requested Amount"),
    component: FormattedField,
    prefix: "$",
    thousandSeparator: true,
  },
  {
    value: form.repayment.value,
    message: form.repayment.message,
    name: "repayment",
    label: requiredFieldLabel("Repayment"),
    component: FormattedField,
    prefix: "$",
    thousandSeparator: true,
  },
  {
    value: form.graduationDate.value,
    message: form.graduationDate.message,
    name: "graduationDate",
    label: requiredFieldLabel("Expected Graduation Date"),
    component: DatePicker,
  },
  {
    value: form.releaseToServicing.value,
    message: form.releaseToServicing.message,
    name: "releaseToServicing",
    label: requiredFieldLabel("Release to Servicing"),
    component: FormattedField,
  },
];

export const repaymentTerms = (form) => [
  {
    value: form.apr.value,
    message: form.apr.message,
    name: "apr",
    label: "Annual Percentage Rate (APR)",
    component: FormattedField,
    prefix: "$",
    thousandSeparator: true,
  },
  {
    value: form.interestRate.value,
    message: form.interestRate.message,
    name: "interestRate",
    label: "Interest Rate",
    component: FormattedField,
    prefix: "$",
    thousandSeparator: true,
  },
  {
    value: form.inSchoolPayment.value,
    message: form.inSchoolPayment.message,
    name: "inSchoolPayment",
    label: "In School Payment",
    component: FormattedField,
  },
  {
    value: form.afterSchoolPayment.value,
    message: form.afterSchoolPayment.message,
    name: "afterSchoolPayment",
    label: "After School Payment",
    component: FormattedField,
  },
];
