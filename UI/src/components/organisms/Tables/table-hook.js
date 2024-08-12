import { useState } from "react";
// THIS HOOK IS USED WITH PAGINATATED TALBE THAT CAN BE FOUND IN COMPONENTS/ORGANISMS/TABLE

export const usePaginatedTable = ({
  itemsPerPageDefault = 15,
  api,
  payload = {},
}) => {
  if (typeof api !== "function") throw new Error("you need to provide an api");
  const [page, setPage] = useState(0);
  const [tableData, setTableData] = useState({ items: [], rows: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTable = async (props) => {
    if (typeof api === "function") {
      setLoading(true);
      const perPage = props?.perPage || itemsPerPageDefault;
      const result = await api({
        ...payload,
        perPage,
        skip: page,
        ...props,
      }); // calling the api cb and passing the endpoint query data
      setLoading(false);
      if (result && result.data) {
        setTableData({
          items: result.data.rows,
          total: result.data.total,
          perPage,
        });
      } else {
        setError("something went wrong");
        setTableData({ items: [], rows: [], total: 0 });
      }
    }
  };

  // CHANGE NUMBER OF ITEMS PER PAGE
  const onChangePerPage = async (e) => {
    const { value } = e.target;
    fetchTable({ perPage: +value });
  };

  // CHANGE PAGE
  const onChangePageHandler = (pager) => {
    if (page !== pager.startIndex) {
      setPage(pager.startIndex);
      fetchTable({ skip: pager.startIndex, perPage: pager.pageSize });
    }
  };

  return {
    pagination: {
      currentPage: page,
      numberOfItems: tableData?.total || 0,
      perPage: tableData.perPage,
      getPageNumber: onChangePageHandler,
      onChangePerPage,
    },
    fetchTable,
    tableData,
    loading,
    error,
  };
};
