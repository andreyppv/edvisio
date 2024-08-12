import React from "react";
import styled from "styled-components";
import { ClassicTable, Cell } from "../../../../../atoms/Table";
import { tableRowChessBackground } from "../../../../../atoms/Table/Elements";
import { ReactComponent as CheckedIcon } from "../../../../../../assets/svgs/checked.svg";
import Row from "./Row";
import Tr from "./Row/styles";
import SubmitBtn from "../../../../../molecules/Buttons/SubmitButton";
import Loader from "../../../../../molecules/Loaders/LoaderWrapper";

const SubmitButton = styled(SubmitBtn)`
  margin-top: 12px;
  width: 240px;
  svg path {
    fill: #fff;
  }
`;

const TableWrapper = styled(ClassicTable)`
  ${tableRowChessBackground}
  border: 1px solid var(--color-gray-3);
  border-radius: 6px;
  overflow: hidden;
`;

const CertifyApplicationTable = ({
  setEditedFieldName,
  fetchingData,
  tableData,
  onChangeHandler,
  editedFieldName,
  loading,
  onSubmitHandler,
  fields,
  isViewMode,
}: any) => {
  const {
    borrowerInformation,
    coSignerInformation,
    applicationInformation,
    certificationInformation,
  } = fields;
  return (
    <Loader loading={fetchingData}>
      <div>
        <TableWrapper>
          <table>
            <tbody>
              <Tr>
                <td>
                  <Cell className="cell">School Name:</Cell>
                </td>
                <td>
                  <Cell className="cell border">DemoSchool</Cell>
                </td>
              </Tr>
              <Row
                fields={borrowerInformation(tableData.borrowerInfo)}
                setEditedFieldName={setEditedFieldName}
                editedFieldName={editedFieldName}
                loading={fetchingData}
                onChange={({ value, fieldName }: any) =>
                  onChangeHandler({ value, fieldName, name: "borrowerInfo" })
                }
              />
              <Row
                fields={coSignerInformation(tableData.coSignerInfo)}
                setEditedFieldName={setEditedFieldName}
                editedFieldName={editedFieldName}
                loading={fetchingData}
                onChange={({ value, fieldName }: any) =>
                  onChangeHandler({ value, fieldName, name: "coSignerInfo" })
                }
              />
              <Row
                fields={applicationInformation(tableData.applicationInfo)}
                setEditedFieldName={setEditedFieldName}
                editedFieldName={editedFieldName}
                loading={fetchingData}
                onChange={({ value, fieldName }: any) =>
                  onChangeHandler({ value, fieldName, name: "applicationInfo" })
                }
              />
              <Row
                fields={certificationInformation(tableData.certificationInfo)}
                setEditedFieldName={setEditedFieldName}
                editedFieldName={editedFieldName}
                loading={fetchingData}
                onChange={({ value, fieldName }: any) =>
                  onChangeHandler({
                    value,
                    fieldName,
                    name: "certificationInfo",
                  })
                }
              />
            </tbody>
          </table>
        </TableWrapper>
        {!isViewMode ? (
          <SubmitButton
            className="contained"
            onClick={onSubmitHandler}
            loading={loading}
            disabled={!!editedFieldName}
          >
            <CheckedIcon />
            Certify Application
          </SubmitButton>
        ) : (
          ""
        )}
      </div>
    </Loader>
  );
};

export default CertifyApplicationTable;
