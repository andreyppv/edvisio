import React from "react";
import styled from "styled-components";
import { ContainerLg as Container } from "../../Containers";
import { ReactComponent as PhoneIcon } from "../../../assets/svgs/phone.svg";
import { ReactComponent as EnvelopeIcon } from "../../../assets/svgs/envelope.svg";

const Wrapper = styled.div`
  height: var(--footer-height);
  background: #fff;
  display: flex;
  align-items: center;

  .container {
    display: flex;
    justify-content: space-between;

    & ul {
      list-style: none;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;

      & svg path {
        fill: var(--color-primary-green-1);
      }

      & li {
        &,
        & a {
          font-size: 12px;
          color: var(--color-gray-2);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        & a {
          text-decoration: none;
          color: var(--color-primary-dark-1);
        }
      }
    }
  }
`;

const Footer = () => {
  return (
    <Wrapper>
      <Container className="container">
        <ul>
          <li>
            <b>For program related questions, please contact your school</b>
          </li>
        </ul>
        <ul>
          <li>
            <b>
              For technical/system related questions, please call TuitionFlex
              Customer Service at
            </b>
          </li>
          <li>
            <PhoneIcon />
            <a href="tel:8667587123"> (866) 758-7123</a>
          </li>
          <li>
            <b>or write us at</b>
          </li>
          <li>
            <EnvelopeIcon />
            <a href="mailto:customerservise@tuitionflex.com">
              customerservise@tuitionflex.com
            </a>
          </li>
        </ul>
      </Container>
    </Wrapper>
  );
};

export default Footer;
