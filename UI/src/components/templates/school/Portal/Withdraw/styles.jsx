import styled from "styled-components";

const FormWrapper = styled.form`
  min-height: 300px;
  .body,
  .header,
  .heading,
  .footer {
    padding: 24px;
  }

  .footer,
  .header {
    background: var(--color-bg-2);
  }

  .body,
  .header,
  .heading {
    border-bottom: 1px solid var(--color-gray-4);
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & .close-btn {
      border: none;
      background: none;
      & svg path {
        fill: var(--color-primary-dark);
      }
    }

    & .title {
      text-transform: upperCase;
      font-weight: 700;
      font-size: 18px;
    }

    & .placeholder,
    & .close-btn {
      width: 20px;
    }
  }

  .heading {
    text-align: center;
    font-weight: 700;
  }
  .body {
    width: 500px;
    & .radioGroup {
      & .radio-button-wrapper {
        justify-content: space-between;
        flex-direction: row-reverse;
        & .checkbox-label {
          color: var(--color-primary-dark-1);
          font-size: 14px;
        }
      }
    }
  }
  .footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    .contained {
      width: 130px;
      height: 44px;
    }
    .outlined {
      background: #fff;
    }
  }
`;

export default FormWrapper;
