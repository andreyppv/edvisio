import React from "react";
import SubmitButton from "./SubmitButton";
import { ReactComponent as EnterIcon } from "../../../assets/svgs/login.svg";

const CancelButton = ({
  title,
  loading,
  onClick,
  type = "button",
}: {
  title?: string;
  loading: boolean;
  onClick: any;
  type?: "submit" | "button";
}) => {
  const buttonTitle = title || "save application & Exit";
  return (
    <SubmitButton
      type={type}
      className="outlined"
      loading={loading}
      onClick={onClick}
    >
      <EnterIcon className="enterIcon" />
      {buttonTitle}
    </SubmitButton>
  );
};

export default CancelButton;
