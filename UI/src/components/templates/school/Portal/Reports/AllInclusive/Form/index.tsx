import React from "react";
import styled from "styled-components";
import { Button } from "../../../../../../atoms/Buttons/Regular";
import { parseFormToFormat } from "../../../../../../../utils/form/parsers";
import { initForm, renderFields } from "./config";
import { useForm } from "../../../../../../../hooks/form-control";

const Wrapper = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 12px;

  .textField {
    width: 100%;
  }

  .submitBtn {
    min-width: 105px;
  }
`;

const SearchForm = ({ onChange }: any) => {
  const { form, onChangeHandler } = useForm(initForm());

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
      <Button className="contained submitBtn" onClick={onSubmit}>
        Search
      </Button>
    </Wrapper>
  );
};

export default SearchForm;
