import React from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "../../atoms/Buttons/Regular";

const Btn = styled(Button)`
  display: flex;
  gap: 12px;
  justify-content: center;
  height: 44px;

  &:disabled {
    cursor: not-allowed;
  }

  &.loading {
    cursor: wait;
  }
`;

const SubmitButton = ({
  children,
  onClick,
  className = "contained",
  loading,
  type = "button",
  disabled = false,
}: {
  onClick?: any;
  className?: string;
  loading?: boolean;
  children: any;
  type?: "button" | "submit";
  disabled?: boolean;
}) => {
  return (
    <Btn
      className={`${className} ${loading ? "loading" : ""}`}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading ? <CircularProgress size={20} color="inherit" /> : children}
    </Btn>
  );
};

export default SubmitButton;
