import { v4 as uuid } from "uuid";

export const createRows = Array(32).fill({
  name: "Business Coach",
  description: "Class 17",
  startDate: "01/28/2023",
  endDate: "09/09/2023",
});

export const rows = createRows.map((row) => ({
  ...row,
  screenTracking: uuid(),
}));

export const schoolsOptions = [
  { label: "", value: "", id: "" },
  { label: "Abc School", value: "Abc school", id: "1" },
  { label: "College", value: "College", id: "2" },
  { label: "Lambda School", value: "Lambda School", id: "3" },
];
