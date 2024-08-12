import React from "react";
import Dropdown from "./Dropdown";

export const GThead = () => {
  return (
    <div className="thead">
      <div className="tr">
        <div className="td" />
        <div className="td">Date</div>
        <div className="td">Details</div>
        <div className="td">Status</div>
      </div>
    </div>
  );
};

export const GRows = ({ items = [] }) => {
  return (
    <div className="tbody">
      {items.map(({ id, date, details, status }) => {
        return (
          <div className="tr" key={id}>
            <div className="td">
              <Dropdown screenTrackingId={id} />
            </div>
            <div className="td">{date}</div>
            <div className="td">{details}</div>
            <div className="td">{status}</div>
          </div>
        );
      })}
    </div>
  );
};
