/*eslint-disable*/
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Table from "../../../../../../organisms/Tables/Paginated";
import Rows from "./Rows";
import Thead from "./Thead";
import { fetchTable as api } from "../../../../../../organisms/Tables/mockApi";
import { ClassicTable } from "../../../../../../atoms/Table";
import { tableRowChessBackground } from "../../../../../../atoms/Table/Elements";
import { rows, schoolsOptions } from "./mockRows";
import Card from "../../../../../../atoms/Cards";
import Header from "./Header";
import Header2 from "./Header2";
import Modal from "../../../../../../organisms/Modal/Regular";
import Form from "./Form";
import { usePaginatedTable } from "../../../../../../organisms/Tables/table-hook";
import Loader from "../../../../../../molecules/Loaders/LoaderWrapper";
import { mockRequest } from "../../../../../../../utils/mockRequest";

const Wrapper = styled.div`
  .card {
    padding: 12px;
    border-radius: 4px;
  }
`;

const TableWrapper = styled(ClassicTable)`
  border-radius: 12px;
  border: 1px solid var(--color-gray-3);
  border-radius: 4px;
  ${tableRowChessBackground}

  tbody tr td, {
    border-bottom: 1px solid var(--color-gray-3);
  }

  thead tr th {
    border-bottom: 1px solid var(--color-gray-3);
    border-top: 1px solid var(--color-gray-3);
  }
`;

const TableControls = () => {
  const [open, setOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [isEd2go, setIsEd2go] = useState(false);
  const [query, setQuery] = useState({
    school: "",
    startDate: "",
    endDate: "",
    allowEmptyPeriod: false,
  });
  const { tableData, loading, fetchTable, pagination } = usePaginatedTable({
    api,
    itemsPerPage: 15,
    payload: { page: 1, mockRows: rows },
  });

  const fetchSchoolsOptions = async () => {
    const result = await mockRequest(schoolsOptions);
    if (result && !result.error) {
      setSchools(result);
    }
  };

  const onChangeQueryHandler = (e) => {
    const { value, name } = e.target;
    setQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchTable();
    fetchSchoolsOptions();
  }, []);

  useEffect(() => {
    if (tableData) {
      console.log(query.school);
      fetchTable({ search: query });
    }
  }, [query.school]);

  const closeModalHandler = () => setOpen(false);

  return (
    <Wrapper>
      <Card className="card">
        <TableWrapper>
          <Header
            onClick={() => setOpen(true)}
            selectedSchool={query.school}
            onChange={onChangeQueryHandler}
            schoolsOptions={schools}
          />

          <Header2
            onChange={onChangeQueryHandler}
            form={query}
            isEd2go={isEd2go}
          />

          <Loader loading={loading}>
            <Table
              rows={<Rows items={tableData?.items} cb={fetchTable} />}
              thead={<Thead />}
              pagination={pagination}
              loading={loading}
            />
          </Loader>
        </TableWrapper>
        <Modal
          modalTitle="Add User"
          showHideButton
          open={open}
          modalContent={<Form closeModal={closeModalHandler} cb={fetchTable} />}
          handleClose={closeModalHandler}
        />
      </Card>
    </Wrapper>
  );
};

export default TableControls;
