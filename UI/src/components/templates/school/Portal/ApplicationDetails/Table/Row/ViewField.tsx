import React from "react";
import ActionButton from "../../../../../../molecules/Buttons/ActionButtons";
import { formatCurrency, formatDate } from "../../../../../../../utils/formats";

const ViewField = ({ value, name, isEditable, loading, onClick }: any) => {
  let val = value || "--";

  if (value && (name === "loanTerm" || name === "program")) {
    val = `${value} months`;
  }

  if (value === "interestRate") {
    val = `${value}%`;
  }
  if (
    value &&
    (name === "financialAssistance" ||
      name === "tuitionAmount" ||
      name === "cost")
  ) {
    val = formatCurrency(value);
  }

  if (value instanceof Date) {
    val = formatDate(value);
  }

  return (
    <div className="view-mode field">
      {val}
      {isEditable && !loading ? (
        <div className="buttons-wrapper">
          <ActionButton onClick={onClick} type="edit" />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ViewField;
