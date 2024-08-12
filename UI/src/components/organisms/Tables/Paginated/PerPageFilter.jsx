import React from "react";
import styled from "styled-components";
import Select from "../../../molecules/Controllers/Select";

const Wrapper = styled.div`
  & select {
    padding: 10px;
    padding-right: 20px;
    border: none;
    background: transparent;
    font-size: 10px;
    color: var(--color-gray-2);
    font-weight: 700;
    min-width: unset;
    width: 90px;
  }
`;

export const options = [
  { label: "Show 5", value: 5, id: 5 },
  { label: "Show 10", value: 10, id: 10 },
  { label: "Show 15", value: 15, id: 15 },
  { label: "Show 25", value: 25, id: 25 },
];

const Pages = ({ perPage, onChange }) => {
  return (
    <Wrapper className="pagesCounter">
      <Select value={perPage} options={options} onChange={onChange} />
    </Wrapper>
  );
};

export default Pages;
