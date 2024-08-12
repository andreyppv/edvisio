import React from "react";
import { Route, Switch } from "react-router-dom";
import { routes as route } from "./routes";
import Login from "../../pages/school/authorization/Login";
import ForgotPassword from "../../pages/school/authorization/RecoverPassword";
import Portal from "../../pages/school/portal";
import Search from "../../pages/school/portal/Search";
import Certify from "../../pages/school/portal/Certify";
import CertifyApplication from "../../pages/school/portal/CertifyApplication";
import ViewApplication from "../../pages/school/portal/ViewApplication";
import { UserProvider } from "../../contexts/admin";
import ApplicationHistory from "../../pages/school/portal/ApplicationHistory";
import Reports from "../../pages/school/portal/Reports";
import AllInclusiveReport from "../../pages/school/portal/Reports/All-inclusive";
import Setup from "../../pages/school/portal/Setup";
import Admin from "../../pages/school/portal/Admin/Admin";
import CreditPullAuthorization from "../../pages/school/portal/CreditPullAuthorization";
import IncompleteApplications from "../../pages/school/portal/IncompleteApplications";
import TuitionFlex from "../../pages/school/portal/TuitionFlex";
import TuitionEase from "../../pages/school/portal/TuitionEase";
import TuitionExtend from "../../pages/school/portal/TuitionExtend";
import AdminApplicationHistory from "../../pages/school/portal/Admin/AdminApplicationHistory";
import ManageAcademicPeriods from "../../pages/school/portal/Setup/ManageAcademicPeriods";
import ManageUsers from "../../pages/school/portal/Setup/ManageUsers";

const Routes = () => {
  return (
    <UserProvider>
      <Switch>
        <Route path={route.LOGIN} exact component={Login} />
        <Route path={route.FORGOT_PASSWORD} exact component={ForgotPassword} />
        <Route path={route.SEARCH} exact component={Search} />
        <Route
          path={`${route.CERTIFY_APPLICATION}/:id`}
          exact
          component={CertifyApplication}
        />
        <Route
          path={`${route.VIEW_APPLICATION}/:id`}
          exact
          component={ViewApplication}
        />
        <Route path={route.CERTIFY} exact component={Certify} />
        <Route
          exact
          path={`${route.APPLICATION_HISTORY}/:id`}
          component={ApplicationHistory}
        />
        <Route path={route.HOME} exact component={Portal} />
        <Route path={route.REPORTS} exact component={Reports} />
        <Route
          path={route.REPORT_ALL_INCLUSIVE}
          exact
          component={AllInclusiveReport}
        />
        <Route path={route.SETUP} exact component={Setup} />
        <Route
          path={route.MANAGE_ACADEMIC_PERIODS}
          exact
          component={ManageAcademicPeriods}
        />
        <Route path={route.MANAGE_USERS} exact component={ManageUsers} />
        <Route path={route.ADMIN} exact component={Admin} />
        <Route path={route.TUITION_EASE} exact component={TuitionEase} />
        <Route path={route.TUITION_FLEX} exact component={TuitionFlex} />
        <Route path={route.TUITION_EXTEND} exact component={TuitionExtend} />
        <Route
          path={route.CREDIT_PULL_AUTHORIZATION}
          exact
          component={CreditPullAuthorization}
        />
        <Route
          path={route.INCOMPLETE}
          exact
          component={IncompleteApplications}
        />
        <Route
          path={`${route.ADMIN_VIEW_APPLICATION}/:id`}
          exact
          component={ViewApplication}
        />
        <Route
          path={`${route.ADMIN_APPLICATION_HISTORY}/:id`}
          exact
          component={AdminApplicationHistory}
        />
      </Switch>
    </UserProvider>
  );
};

export default Routes;
