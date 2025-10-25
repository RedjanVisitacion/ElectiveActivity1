const customers = require('./data/customers');
const products = require('./data/products');
const orders = require('./data/orders');

async function insertAll(databases, databaseId, ID){
  // customers
  for(const c of customers){
    try{
      const cDoc = { ...c, customerID: String(c.customerID) };
      await databases.createDocument(databaseId,'customers',ID.unique(),cDoc);
      console.log(`✅ Inserted customer: ${c.firstName} ${c.lastName}`);
    }catch(e){console.log(`❌ Customer ${c.customerID}:`,e.message)}
  }
  // products
  for(const p of products){
    try{
      const pDoc = { ...p, productID: String(p.productID) };
      await databases.createDocument(databaseId,'products',ID.unique(),pDoc);
      console.log(`✅ Inserted product: ${p.productName}`);
    }catch(e){console.log(`❌ Product ${p.productID}:`,e.message)}
  }
  // orders (flatten first line item into top-level fields)
  for(const o of orders){
    try{
      const li=(o.lineItems&&o.lineItems[0])||{};
      const oDoc={
        orderID: String(o.orderID),
        customerID: String(o.customerID),
        dateOrdered: o.dateOrdered,
        shippedDate: o.shippedDate,
        status: o.status,
        lineProductID: String(li.productID),
        lineQuantityOrdered: li.quantityOrdered,
        linePriceEach: li.priceEach
      };
      await databases.createDocument(databaseId,'orders',ID.unique(),oDoc);
      console.log(`✅ Inserted order: ${o.orderID}`);
    }catch(e){console.log(`❌ Order ${o.orderID}:`,e.message)}
  }
}
module.exports={insertAll};
