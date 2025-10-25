const customers = require('./data/customers');
const menus = require('./data/menus');
const orders = require('./data/orders');

async function insertAll(databases, databaseId, ID){
  for(const c of customers){
    try{ await databases.createDocument(databaseId,'customers',ID.unique(),c); console.log(`✅ Inserted customer: ${c.firstName} ${c.lastName}`);}catch(e){console.log(`❌ Failed to insert customer ${c.firstName}:`,e.message)}
  }
  for(const m of menus){
    try{
      const mDoc={...m,categoryID:m.category?.categoryID,categoryName:m.category?.categoryName};
      delete mDoc.category;
      await databases.createDocument(databaseId,'menus',ID.unique(),mDoc);
      console.log(`✅ Inserted menu: ${m.menuName}`);
    }catch(e){console.log(`❌ Failed to insert menu ${m.menuName}:`,e.message)}
  }
  for(const o of orders){
    try{
      const li=(o.lineItems&&o.lineItems[0])||{};
      const oDoc={
        orderID:o.orderID,
        dateOrdered:o.dateOrdered,
        customerID:o.customer?.customerID,
        customerFirstName:o.customer?.firstName,
        customerLastName:o.customer?.lastName,
        itemMenuID:li.menuID,
        itemMenuName:li.menuName,
        itemQuantity:li.quantity,
        itemPriceAtTimeOfOrder:li.priceAtTimeOfOrder,
        itemTotalPrice:li.totalPrice,
        totalAmount:o.totalAmount
      };
      await databases.createDocument(databaseId,'orders',ID.unique(),oDoc);
      console.log(`✅ Inserted order ${o.orderID}`);
    }catch(e){console.log(`❌ Failed to insert order ${o.orderID}:`,e.message)}
  }
}
module.exports={insertAll};
