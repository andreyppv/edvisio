import { v4 as uuid } from "uuid";

export const array = Array(232).fill({
  school: "ABC School",
  program: "Tuition Flex",
  startDate: "08/08/2022",
  endDate: "08/08/2025",
  date: "08/08/2022",
  product: "paul cat",
  appId: "666-12-4567",
  borrowerName: "Temeka Adams",
  studentName: "Temeka Adams",
  ssn: "123456789",
  altIdType: "Item",
  altIdNumber: "Item",
  status: "Active",
  requestedAmount: "12034",
  amountApproved: "12034",
  phoneNumber: "1666234234",
  sentToServicerDate: "08/08/2022",
});

export const rows = array.map((row) => {
  return {
    ...row,
    screenTrackingId: uuid(),
  };
});
