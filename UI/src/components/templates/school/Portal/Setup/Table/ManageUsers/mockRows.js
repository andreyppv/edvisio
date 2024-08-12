import { v4 as uuid } from "uuid";

const createRows = Array(32).fill({
  lastName: "Adams",
  firstName: "Temeka",
  email: "temekaadams@example.com",
  lastLoginDate: "08/08/2022",
  status: "Active",
  group: "CRM Administrations",
});

export const rows = createRows.map((row) => ({
  ...row,
  screenTracking: uuid(),
}));
