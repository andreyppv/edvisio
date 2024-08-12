import React from "react";
import styled from "styled-components";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { H5 as Heading } from "../../../atoms/Typography";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 24px;
  .heading {
    color: var(--color-primary-dark-1);
  }
`;

const Header = ({ text, onClose }) => {
  return (
    <Wrapper className="form-header">
      <Heading className="form-heading">{text}</Heading>
      <IconButton aria-label="close" onClick={onClose}>
        <CloseIcon />
      </IconButton>
    </Wrapper>
  );
};

export default Header;
