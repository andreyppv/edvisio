import React from "react";
import { Cell } from "../../../../../../atoms/Table";
import Tr from "./styles";
import EditField from "./EditField";
import CommonField from "./ViewField";
import StudentIdField from "./StudentIdField";

const ViewField = ({ name, ...props }: any) => {
  if (name === "studentId") {
    return <StudentIdField name={name} {...props} />;
  }
  return <CommonField name={name} {...props} />;
};

const Row = ({
  fields,
  editedFieldName,
  setEditedFieldName,
  loading,
  onChange,
}: any) => {
  return (
    <Tr>
      <td>
        <Cell className="cell">
          <ul>
            <li>
              <div>{fields?.labels?.heading}</div>
              <ul className="form-labels">
                {fields?.labels?.subheadings.map((item: any) => {
                  return <li key={item}>{item}</li>;
                })}
              </ul>
            </li>
          </ul>
        </Cell>
      </td>
      <td>
        <Cell className="cell border">
          <ul className="form-values">
            {fields?.form.map(({ isEditable, ...item }: any) => {
              return (
                <li key={item.name}>
                  {editedFieldName === item.name && isEditable ? (
                    <EditField
                      {...item}
                      onChange={onChange}
                      onCancel={() => setEditedFieldName("")}
                    />
                  ) : (
                    <ViewField
                      loading={loading}
                      onClick={() => setEditedFieldName(item.name)}
                      isEditable={isEditable}
                      {...item}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </Cell>
      </td>
    </Tr>
  );
};

export default Row;
