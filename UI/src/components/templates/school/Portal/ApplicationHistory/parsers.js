import React from "react";
import { StyledLink as Link } from "../../../../atoms/Buttons/Regular";
import { routes } from "../../../../../routes/School/routes";
import {
  formatDate,
  formatCurrency,
  formatPhoneNumber,
} from "../../../../../utils/formats";

export const parseCosignerInfo = ({
  conSignerName = "",
  coSignerSSN = "",
  coSignerEmail = "",
}) => [
  { label: "Cosigner name:", value: conSignerName, id: "1" },
  { label: "Cosigner SSN:", value: coSignerSSN, id: "2" },
  { label: "Cosigner Email:", value: coSignerEmail, id: "3" },
];

export const parseBorrowerInfo = ({
  borrowerName = "",
  borrowerSSN = "",
  borrowerEmail = "",
}) => [
  { label: "Borrower name:", value: borrowerName, id: "1" },
  { label: "Borrower SSN:", value: borrowerSSN, id: "2" },
  { label: "Borrower Email:", value: borrowerEmail, id: "3" },
];

export const parseAppProfile = ({
  appId = "",
  product = "",
  program = "",
  dateCreated = "",
  dateUpdated = "",
  periodStartDatetoEndDate = "",
  requestedAmount = "",
  approvedAmount = "",
  organization = "",
}) => [
  {
    label: "App ID:",
    value: <Link to={`${routes.VIEW_APPLICATION}/${appId}`}>{appId}</Link>,
    id: "1",
  },
  { label: "Product:", value: product, id: "2" },
  { label: "Academic Program:", value: program, id: "3" },
  { label: "Date Created:", value: formatDate(dateCreated), id: "4" },
  { label: "Last Updated:", value: formatDate(dateUpdated), id: "5" },
  {
    label: "Period Start Date to Period End Date:",
    value: periodStartDatetoEndDate,
    id: "6",
  },
  {
    label: "Amount Requested:",
    value: formatCurrency(requestedAmount),
    id: "7",
  },
  { label: "Amount Approved:", value: formatCurrency(approvedAmount), id: "8" },
  { label: "Organization:", value: organization, id: "9" },
];

export const parseAddress = ({
  type = "",
  address = "",
  city = "",
  state = "",
  phoneNumber = "",
}) => [
  {
    label: "Type:",
    value: <Link to={`${routes.VIEW_APPLICATION}/${type}`}>{type}</Link>,
    id: "1",
  },
  { label: "Address:", value: address, id: "2" },
  { label: "City:", value: city, id: "3" },
  { label: "State:", value: state, id: "4" },
  { label: "Phone Number:", value: formatPhoneNumber(phoneNumber), id: "5" },
];

export const parseReferenceHistory = ({
  borrowerName = "",
  relationship = "",
  phoneNumber = "",
}) => [
  { label: "Name", value: borrowerName, id: "1" },
  { label: "Relationship", value: relationship, id: "2" },
  { label: "Phone Number", value: formatPhoneNumber(phoneNumber), id: "3" },
];
