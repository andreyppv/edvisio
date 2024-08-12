import React from "react";
import styled from "styled-components";
import Pagination from "./Pagination";
import PageOfPages from "./PageNumber";
import PerPageFilter from "./PerPageFilter";

export const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
`;

const TableWrapper = styled.div`
  .table-loading-placeholder {
    height: 100px;
  }

  .no-items-placeholder {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 12px;
    font-weight: 700;
    color: var(--color-gray-2);
  }
`;

const TableView = ({
  thead,
  rows,
  loading,
  pagination: {
    getPageNumber,
    numberOfItems,
    perPage,
    currentPage,
    onChangePerPage,
  },
}) => {
  const renderTable = () => {
    return (
      <table>
        <thead>{thead}</thead>
        <tbody>
          {numberOfItems ? (
            rows
          ) : (
            <tr>
              <td colSpan="100%" className="table-loading-placeholder" />
            </tr>
          )}
        </tbody>
      </table>
    );
  };
  return (
    <TableWrapper className="table-wrapper">
      <div className="table-container">{renderTable()}</div>
      {!loading && !numberOfItems ? (
        <div className="no-items-placeholder">No Items Found</div>
      ) : (
        ""
      )}
      {numberOfItems > perPage ? (
        <TableFooter>
          <PageOfPages
            numberOfItems={numberOfItems}
            perPage={perPage}
            skip={currentPage}
          />
          <Pagination
            data={{ itemsPerPage: perPage, numberOfItems }}
            getPageNumber={getPageNumber}
          />
          <PerPageFilter perPage={perPage} onChange={onChangePerPage} />
        </TableFooter>
      ) : (
        ""
      )}
    </TableWrapper>
  );
};
export default TableView;
