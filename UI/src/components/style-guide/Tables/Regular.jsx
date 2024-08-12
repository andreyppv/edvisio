import React, { useState } from "react";
import Menu from "../../organisms/Menu/TableRow";
import { menuButtons } from "../../organisms/Menu/TableRow/config";

export const Thead = () => {
  return (
    <thead>
      <tr>
        <th>
          <div className="cell">Date</div>
        </th>
        <th>
          <div className="cell border">Details</div>
        </th>
        <th>
          <div className="cell border">Status</div>
        </th>
      </tr>
    </thead>
  );
};

export const Rows = ({ items = [] }) => {
  const [open, setOpen] = useState("");

  const toggleMenu = (name) => {
    if (name !== open) {
      setOpen(name);
    } else {
      setOpen("");
    }
  };
  return (
    <tbody>
      {items.map(({ id, date, details, status }) => {
        const active = open === id;
        return (
          <tr key={id}>
            <Menu
              active={active}
              onToggle={() => toggleMenu(id)}
              buttons={menuButtons}
            />
            <td>
              <div className="cell">{date}</div>
            </td>
            <td>
              <div className="cell border">{details}</div>
            </td>
            <td>
              <div className="cell border">{status}</div>
            </td>
          </tr>
        );
      })}
    </tbody>
  );
};
