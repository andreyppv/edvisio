export const filtersApplied = ({
  startDate = new Date(),
  endDate,
  searchedBy,
  name,
}) => [
  { label: "Start Date:", value: startDate, id: "1" },
  { label: "End Date:", value: endDate, id: "2" },
  { label: "Searched By:", value: searchedBy, id: "3" },
  { label: "Created By:", value: name, id: "4" },
  { label: "Created Date:", value: new Date(), id: "5" },
];
