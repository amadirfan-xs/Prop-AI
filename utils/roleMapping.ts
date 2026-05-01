export const getRoleName = (id: number | null) => {
  switch (id) {
    case 1:
      return "Agent";
    case 2:
      return "Seller";
    case 3:
      return "Buyer";
    case 4:
      return "Organization";
    case 5:
      return "Org Agent";
    default:
      return "Agent";
  }
};
