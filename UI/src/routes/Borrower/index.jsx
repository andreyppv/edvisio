import React from "react";
import { Route, Switch } from "react-router-dom";
import { routes as route } from "./routes";
import Login from "../../pages/borrower/authorization";
import MultifactorVerification from "../../pages/borrower/authorization/Verification";
import Portal from "../../pages/borrower/portal";
import { UserProvider } from "../../contexts/admin";

const Routes = () => {
  return (
    <UserProvider>
      <Switch>
        <Route path={route.LOGIN} exact component={Login} />
        <Route
          path={route.VERIFICATION}
          exact
          component={MultifactorVerification}
        />
        <Route path={route.PORTAL} exact component={Portal} />
      </Switch>
    </UserProvider>
  );
};

export default Routes;
