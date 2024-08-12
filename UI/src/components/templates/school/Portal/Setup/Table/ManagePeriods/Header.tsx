/*eslint-disable*/
import React from "react";
import styled from "styled-components";
import { Subtitle as Heading } from "../../../../../../atoms/Typography";
import { Button } from "../../../../../../atoms/Buttons/Regular";
import { ReactComponent as AddIcon } from "../../../../../../../assets/svgs/add.svg";
import { ReactComponent as ListIcon } from "../../../../../../../assets/svgs/list.svg";
import Select from "../../../../../../molecules/Controllers/Select";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;

  .action-buttons-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 44px;
  }

  .input-wrapper select {
    border: 1px solid var(--color-gray-3);
    border-radius: 4px;
    background: #fff;
    padding: 13px 30px 13px 12px;
  }

  .contained {
    display: flex;
    display: flex;
    align-items: center;
    gap: 8px;
    height: 44px;
    text-transform: upperCase;
  }
`;

const Header = ({ onClick, onChange, selectedSchool, schoolsOptions }: any) => {
  return (
    <Wrapper>
      <Heading>Manage Academic Periods</Heading>
      <div className="action-buttons-wrapper">
        <Select
          onChange={onChange}
          options={schoolsOptions}
          value={selectedSchool}
          name="school"
        />
        <Button className="contained">
          add school
          <AddIcon />
        </Button>
        <Button className="contained">
          import
          <ListIcon />
        </Button>
        <Button className="contained" onClick={onClick}>
          add academic period
          <AddIcon />
        </Button>
      </div>
    </Wrapper>
  );
};

export default Header;
