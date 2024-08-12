import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "../../../../../atoms/Buttons/Regular";
import { parseFormToFormat } from "../../../../../../utils/form/parsers";
import { initForm, renderFields } from "./config";

const Wrapper = styled.div`
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  align-items: center;
  grid-column-gap: 12px;
  grid-row-gap: 24px;

  .submitBtn {
    grid-column: 4 / -1;
  }
`;

const SearchForm = ({ onChange }: any) => {
  const [form, setForm] = useState(initForm());

  const onChangeHandler = (e: any) => {
    const { value, name } = e.target;
    setForm((prevState) => ({ ...prevState, [name]: { value, message: "" } }));
  };

  const onSubmit = () => {
    const payload = parseFormToFormat(form);
    onChange(payload);
  };

  return (
    <Wrapper>
      {renderFields(form).map(({ component: Component, ...field }) => {
        return (
          <Component key={field.name} {...field} onChange={onChangeHandler} />
        );
      })}
      <Button className="outlined submitBtn" onClick={onSubmit}>
        Search
      </Button>
    </Wrapper>
  );
};

export default SearchForm;
