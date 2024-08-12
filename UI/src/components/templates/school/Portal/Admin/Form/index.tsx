import React, { useState } from "react";
import styled from "styled-components";
import { parseFormToFormat } from "../../../../../../utils/form/parsers";
import { initForm, renderFields } from "./config";
import SubmitButton from "../../../../../molecules/Buttons/SubmitButton";

const Wrapper = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  grid-column-gap: 12px;
  grid-row-gap: 24px;

  .submitBtn {
    grid-column: 4 / 0;
  }
`;

const SearchForm = ({ onChange }: any) => {
  const [form, setForm] = useState(initForm());
  const [loading, setLoading] = useState(false);

  const onChangeHandler = (e: any) => {
    const { value, name } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: { value, message: "" } }));
  };

  const onSubmit = () => {
    setLoading(true);
    const payload = parseFormToFormat(form);
    onChange(payload);
    setLoading(false);
  };

  return (
    <Wrapper>
      {renderFields(form).map(({ component: Component, ...field }) => {
        return (
          <Component key={field.name} {...field} onChange={onChangeHandler} />
        );
      })}
      <SubmitButton
        className="contained submitBtn"
        onClick={onSubmit}
        loading={loading}
        disabled={false}
      >
        Search
      </SubmitButton>
    </Wrapper>
  );
};

export default SearchForm;
