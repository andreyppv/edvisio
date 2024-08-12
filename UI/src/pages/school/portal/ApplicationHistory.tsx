import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Layout from "../../../layouts/school/Portal";
import GoBackBtn from "../../../components/molecules/Buttons/GoBack";
import BreadCrumbs from "../../../components/organisms/BreadCrumbs";
import { routes } from "../../../routes/School/routes";
import { H5 } from "../../../components/atoms/Typography";
import Card from "../../../components/atoms/Cards";
import Content from "../../../components/templates/school/Portal/ApplicationHistory";
import { mockRequest } from "../../../utils/mockRequest";
import { userMock } from "../../../components/templates/school/Portal/ApplicationHistory/mockData";
import { transactionsMock } from "../../../components/templates/school/Portal/ApplicationHistory/History/mockData";
import Loader from "../../../components/molecules/Loaders/LoaderWrapper";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 0;

  .bread-crumbs-wrapper {
    display: flex;
    gap: 12px;
  }
`;

// BREAD CRUMBS BUTTONS
const items = ({ loanName }: { loanName: string }) => [
  { label: "Certify Applications", link: routes.CERTIFY, id: "1" },
  { label: loanName, link: "", id: "2" },
];

const ApplicationHistory = () => {
  const [userData, setUserData] = useState({});
  const [transactionsData, setTransactionsData] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const user = await mockRequest(userMock, 500);
    const transactions = await mockRequest(transactionsMock, 500);
    setUserData(user);
    setTransactionsData(transactions);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout currentRoute={routes.CERTIFY}>
      <Wrapper>
        <H5>Application History</H5>
        <div className="bread-crumbs-wrapper">
          <GoBackBtn />
          <BreadCrumbs items={items({ loanName: "View LN_11667" })} />
        </div>
        <Card className="table-wrapper-card">
          <Loader loading={loading}>
            <Content userData={userData} transactionsData={transactionsData} />
          </Loader>
        </Card>
      </Wrapper>
    </Layout>
  );
};

export default ApplicationHistory;
