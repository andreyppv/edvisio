import { v4 as uuid } from "uuid";

const createRows = Array(32).fill({
  school: "ABC School",
  appId: "LN_11667",
  date: "09/09/2022",
  program: "Item",
  applicantName: "Temeka Adams",
  studentName: "Temeka Adams",
  ssn: "348-72-9769",
  altIdTyp: "N/A",
  altIdNumber: "N/A",
  status: "N/A",
  amount: "N/A",
  decision: "N/A",
  fico: "N/A",
});

export const rows = createRows.map((row) => ({
  ...row,
  screenTracking: uuid(),
}));
