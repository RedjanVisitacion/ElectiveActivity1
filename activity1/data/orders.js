module.exports = [
  {
    orderID: "1",
    dateOrdered: "1999-08-05T10:30:00Z",
    customer: { customerID: "1", firstName: "Shoji", lastName: "Tokyo" },
    lineItems: [
      { menuID: "2", menuName: "Kung Pao Chicken", quantity: 4, priceAtTimeOfOrder: 200, totalPrice: 800 }
    ],
    totalAmount: 800
  },
  {
    orderID: "2",
    dateOrdered: "1999-08-15T14:00:00Z",
    customer: { customerID: "2", firstName: "Shokai", lastName: "Osaka" },
    lineItems: [
      { menuID: "3", menuName: "Ma Po Tofu", quantity: 5, priceAtTimeOfOrder: 350, totalPrice: 1750 }
    ],
    totalAmount: 1750
  },
  {
    orderID: "3",
    dateOrdered: "1999-08-30T18:45:00Z",
    customer: { customerID: "3", firstName: "Shonen", lastName: "Chugoku" },
    lineItems: [
      { menuID: "1", menuName: "Sweet and Sour Pork", quantity: 3, priceAtTimeOfOrder: 300, totalPrice: 900 }
    ],
    totalAmount: 900
  },
  {
    orderID: "4",
    dateOrdered: "2000-01-10T09:00:00Z",
    customer: { customerID: "4", firstName: "Juan", lastName: "Garcia" },
    lineItems: [
      { menuID: "4", menuName: "Fried Rice", quantity: 2, priceAtTimeOfOrder: 120, totalPrice: 240 }
    ],
    totalAmount: 240
  },
  {
    orderID: "5",
    dateOrdered: "1998-12-20T11:00:00Z",
    customer: { customerID: "5", firstName: "Maria", lastName: "Dela Cruz" },
    lineItems: [
      { menuID: "5", menuName: "Spring Roll", quantity: 2, priceAtTimeOfOrder: 80, totalPrice: 160 }
    ],
    totalAmount: 160
  }
];
