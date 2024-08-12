import React from "react";
import styled from "styled-components";
import BreadCrumbs from "../organisms/BreadCrumbs";

const Wrapper = styled.div`
  padding: 40px;
  section {
    display: flex;
    column-gap: 20px;
    margin-bottom: 20px;
  }
`;

const config = [
  { label: "level 1", link: "/school/login", id: "1" },
  { label: "level 2", link: "/school/login", id: "2" },
  { label: "level 3", link: "/school/login", id: "3" },
  { label: "level 4", link: "/school/login", id: "4" },
];

const BreadCrumbsComponent = () => {
  return (
    <Wrapper>
      <section>
        <BreadCrumbs items={config} />
      </section>
    </Wrapper>
  );
};

export default BreadCrumbsComponent;
