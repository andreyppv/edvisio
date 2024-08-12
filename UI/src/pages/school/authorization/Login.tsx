import React from "react";
import Layout from "../../../layouts/school/Login";
import { ReactComponent as Logo } from "../../../assets/svgs/logos/logo-tuition-flex.svg";
import LoginForm from "../../../components/templates/school/authorization/Login/Login";

const Login = () => {
  return (
    <Layout>
      <div>
        <Logo className="logo" />
        <LoginForm />
      </div>
    </Layout>
  );
};

export default Login;
