import React from "react";
import TextField from "../../../../molecules/Controllers/TextField/Placeholder-label";
import { Button } from "../../../../atoms/Buttons/Regular";
import { Subtitle as Heading } from "../../../../atoms/Typography";

const Form = ({ form, onChange, onSubmit }) => {
  return (
    <div className="form-wrapper">
      <Heading className="form-heading">Please, enter your email below</Heading>
      <TextField
        value={form.email.value}
        name="email"
        onChange={onChange}
        label="Email Address"
        message={form.email.message}
      />
      <Button className="contained submit-btn" type="button" onClick={onSubmit}>
        continue
      </Button>
    </div>
  );
};

export default Form;
