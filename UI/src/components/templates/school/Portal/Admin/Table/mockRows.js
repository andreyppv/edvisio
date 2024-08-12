import { v4 as uuid } from "uuid";

const array = Array(232).fill({
  school: "ABC School",
  program: "Tuition Flex",
  date: "08/08/2022",
  appId: "666-12-4567",
  borrowerName: "Temeka Adams",
  studentName: "Temeka Adams",
  ssn: "123456789",
  altIdType: "N/A",
  altIdNumber: "N/A",
  status: "N/A",
  requestedAmount: "12034",
  amountApproved: "12034",
  phoneNumber: "1666234234",
  sentToServicerDate: "08/08/2022",
  screenTrackingId: "12345",
});

export const rows = array.map((row) => {
  return {
    ...row,
    screenTrackingId: uuid(),
  };
});
