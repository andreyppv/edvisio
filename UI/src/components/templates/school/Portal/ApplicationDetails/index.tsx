import React, { useState, useEffect } from "react";
import { groupTableData } from "./certify.config";
import { httpResponse } from "./mockData";
import { mockRequest } from "../../../../../utils/mockRequest";
import Table from "./Table";

interface IApplicationDetails {
  fields: {
    borrowerInformation: [];
    coSignerInformation: [];
    applicationInformation: [];
    certificationInformation: [];
  };
  isViewMode?: boolean;
}

const ApplicationDetails = ({
  fields,
  isViewMode = false,
}: IApplicationDetails) => {
  const [editedFieldName, setEditedFieldName] = useState(""); // accepts field name that should be edited
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [tableData, setTableData] = useState<any>({
    borrowerInfo: {},
    coSignerInfo: {},
    applicationInfo: {},
  });

  // FETCH DATA TO POPULATE THE TABLE
  const fetchData = async () => {
    setFetchingData(true);
    const response = await mockRequest(httpResponse);
    setFetchingData(false);
    if (response && !response.error) {
      const groupedData = groupTableData(response);
      setTableData(groupedData);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSubmitHandler = async () => {
    setLoading(true);
    await mockRequest();
    setLoading(false);
  };

  // UPDATE VALUE ON THE UI IF THE HTTP REQUEST IS SUCCESSFUL
  // THIS SHOULD PREVENT THE UI FROM REFETCHING THE SAVED DATA
  const onChangeHandler = ({
    value,
    name,
    fieldName,
  }: {
    value: string;
    name:
      | "borrowerInfo"
      | "coSignerInfo"
      | "applicationInfo"
      | "certificationInfo";
    fieldName: string;
  }) => {
    const updatedTable = { ...tableData };
    const section = { ...updatedTable[name] };
    section[fieldName] = value;
    updatedTable[name] = section;
    setTableData(updatedTable);
  };

  return (
    <Table
      tableData={tableData}
      isViewMode={isViewMode}
      loading={loading}
      setEditedFieldName={setEditedFieldName}
      fields={fields}
      fetchingData={fetchingData}
      onChangeHandler={onChangeHandler}
      editedFieldName={editedFieldName}
      onSubmitHandler={onSubmitHandler}
    />
  );
};

export default ApplicationDetails;
