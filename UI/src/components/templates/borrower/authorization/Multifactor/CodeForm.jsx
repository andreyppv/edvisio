import React from "react";
import SendCode from "./SendCode";
import SubmitButton from "../../../../molecules/Buttons/SubmitButton";
import FormattedField from "../../../../molecules/Controllers/FormattedField/Placeholder-label";
import { Subtitle as Heading } from "../../../../atoms/Typography";

const CodeForm = ({ form, onSubmit, onChange, loading }) => {
  return (
    <div className="form-wrapper">
      <Heading className="form-heading">
        We sent code on your Email Address. Please, input it below
      </Heading>
      <FormattedField
        name="code"
        value={form.code.value}
        message={form.code.message}
        format="####"
        label="Verification Code"
        onChange={onChange}
      />
      <SendCode />
      <SubmitButton
        className="submit-btn contained"
        onClick={onSubmit}
        loading={loading}
      >
        continue
      </SubmitButton>
    </div>
  );
};

export default CodeForm;
