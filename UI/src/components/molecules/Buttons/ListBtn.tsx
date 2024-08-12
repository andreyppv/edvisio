import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Text, Caption } from "../../atoms/Typography";

const Button = styled.div`
  display: flex;
  align-items: stretch;
  box-shadow: var(--shadow-2);
  border-radius: 4px;
  & .logo-wrapper {
    padding: 25px;
    display: flex;
    align-items: center;
    background: var(--color-bg-2);
  }

  & a {
    text-decoration: none;
    color: inherit;
    font-weight: 600;
    transition: all 0.3s;

    &:hover {
      text-decoration: underline;
    }
  }

  & .content {
    background: #fff;
    padding: 16px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    gap: 6px;
    width: 100%;
  }
`;

interface IListButton {
  title: string;
  link: string;
  subtitle?: string;
  logo: any;
}

const ListButton = ({ title, link, subtitle, logo }: IListButton) => {
  return (
    <Button>
      <div className="logo-wrapper">{logo}</div>
      <div className="content">
        <Text className="title">
          <Link to={link}>{title}</Link>
        </Text>
        {subtitle ? <Caption className="subtitle">{subtitle}</Caption> : ""}
      </div>
    </Button>
  );
};

export default ListButton;
