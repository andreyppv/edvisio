import React from "react";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { DatePickerWrapper } from "../styles";
import Label from "../Elements/FieldLabel";
import Error from "../Elements/FieldError";

export default function DobPicker({
  label = "",
  onChange,
  message = "",
  name,
  disabled = false,
  value = new Date(),
}: any) {
  const onChangeHandler = (e: any) => {
    const event = { target: { value: e, name } };
    onChange(event);
  };
  const error = !!message;
  return (
    <DatePickerWrapper
      className={`textField ${error ? "isError" : ""} ${
        value ? "isFilled" : ""
      }`}
    >
      {label ? <Label label={label} /> : ""}
      <div style={{ position: "relative" }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            label={label}
            disabled={disabled}
            inputFormat="MM/dd/yyyy"
            value={value}
            onChange={onChangeHandler}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
      </div>
      <Error message={message} />
    </DatePickerWrapper>
  );
}
