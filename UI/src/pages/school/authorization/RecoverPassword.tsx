import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Layout from "../../../layouts/school/Login";
import { ReactComponent as Chevron } from "../../../assets/svgs/chevron-left.svg";
import { ReactComponent as Logo } from "../../../assets/svgs/logos/logo-tuition-flex.svg";
import EmailForm from "../../../components/templates/school/authorization/RecoverPassword/Email";
import VerificationCode from "../../../components/templates/school/authorization/RecoverPassword/VerificationCode";
import NewPassword from "../../../components/templates/school/authorization/RecoverPassword/NewPassword";
import Success from "../../../components/templates/school/authorization/RecoverPassword/Success";

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  font-weight: 600;
  position: absolute;
  left: 24px;
  top: 24px;
`;

const renderForm = (page: number, nextPage: any) => {
  switch (page) {
    case 1:
      return <EmailForm nextPage={nextPage} />;
    case 2:
      return <VerificationCode nextPage={nextPage} />;
    case 3:
      return <NewPassword nextPage={nextPage} />;
    case 4:
      return <Success />;
    default:
      return <EmailForm nextPage={nextPage} />;
  }
};

const Login = () => {
  const [page, setPage] = useState(1);
  const history = useHistory();

  const nextPage = (number: number) => {
    if (number) {
      setPage(number);
    } else {
      setPage(page + 1);
    }
  };

  const prevPage = () => {
    if (page > 1) {
      // GO BACK TO PREVIOUS STEP
      setPage(page - 1);
    } else {
      // IF ON THE FIRST STEP GO BACK TO PREV PAGE
      history.goBack();
    }
  };
  return (
    <Layout>
      <Button type="button" onClick={prevPage}>
        <Chevron />
        Back
      </Button>
      <div>
        <Logo className="logo" />
        {renderForm(page, nextPage)}
      </div>
    </Layout>
  );
};

export default Login;
