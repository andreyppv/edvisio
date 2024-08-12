import { isDateInFuture } from "../../../../../../../utils/validators/date";

export const validate = (form, fieldName) => {
  let isValid = true;
  const newForm = { ...form };
  if (fieldName === "loanTerm" || fieldName === "program") {
    if (!form.value) {
      newForm.message = "This field is required";
      isValid = false;
    }
  }
  if (
    fieldName === "tuitionAmount" ||
    fieldName === "financialAssistance" ||
    fieldName === "cost"
  ) {
    if (+form.value <= 0) {
      newForm.message = "Enter a valid amount";
      isValid = false;
    }
  }
  if (
    fieldName === "endDate" ||
    fieldName === "startDate" ||
    fieldName === "releaseToServicingDate"
  ) {
    const message = isDateInFuture(form.value);
    if (message) {
      newForm.message = message;
      isValid = false;
    }
  }
  if (fieldName === "studentId") {
    if (form.value.length < 12) {
      newForm.message = "Enter a valid student number";
      isValid = false;
    }
  }
  if (fieldName === "program") {
    if (form.value.trim().length < 1) {
      newForm.message = "This field is required";
      isValid = false;
    }
  }

  return [isValid, newForm];
};
