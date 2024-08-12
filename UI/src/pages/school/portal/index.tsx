import React from "react";
import { Redirect } from "react-router-dom";
import { routes } from "../../../routes/School/routes";

const Portal = () => {
  return <Redirect to={routes.SEARCH} />;
};

export default Portal;
