/*eslint-disable*/
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Table from "../../../../../../organisms/Tables/Paginated";
import Rows from "./Rows";
import Thead from "./Thead";
import { fetchTable as api } from "../../../../../../organisms/Tables/mockApi";
import { ClassicTable } from "../../../../../../atoms/Table";
import { tableRowChessBackground } from "../../../../../../atoms/Table/Elements";
import { rows } from "./mockRows";
import Card from "../../../../../../atoms/Cards";
import Header from "./Header";
import Modal from "../../../../../../organisms/Modal/Regular";
import Form from "./Form";
import { usePaginatedTable } from "../../../../../../organisms/Tables/table-hook";
import Loader from "../../../../../../molecules/Loaders/LoaderWrapper";

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
  const { tableData, loading, fetchTable, pagination } = usePaginatedTable({
    api,
    itemsPerPage: 15,
    payload: { page: 1, mockRows: rows },
  });

  useEffect(() => {
    fetchTable();
  }, []);

  const closeModalHandler = () => setOpen(false);

  return (
    <Wrapper>
      <Card className="card">
        <TableWrapper>
          <Header onClick={() => setOpen(true)} />
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
