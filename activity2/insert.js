const customers = require('./data/customers');
const menus = require('./data/menus');
const orders = require('./data/orders');
const employees = require('./data/employees');
const offices = require('./data/offices');
const productlines = require('./data/productlines');
const products = require('./data/products');
const payments = require('./data/payments');

async function insertAll(databases, databaseId, ID){
  // customers
  for(const c of customers){
    try{
      const cDoc = { ...c, customerID: String(c.customerID) };
      await databases.createDocument(databaseId,'customers',ID.unique(),cDoc);
      console.log(`✅ Inserted customer: ${c.firstName} ${c.lastName}`);
    }catch(e){console.log(`❌ Customer ${c.customerID}:`,e.message)}
  }
  // menus
  for(const m of menus){
    try{
      const mDoc = { ...m, menuID: String(m.menuID) };
      await databases.createDocument(databaseId,'menus',ID.unique(),mDoc);
      console.log(`✅ Inserted menu: ${m.menuName}`);
    }catch(e){console.log(`❌ Menu ${m.menuID}:`,e.message)}
  }
  // orders (flattened only first line item attributes due to attribute limits)
  for(const o of orders){
    try{
      const li=(o.lineItems&&o.lineItems[0])||{};
      const doc={ orderID:String(o.orderID), dateOrdered:o.dateOrdered, customerID:String(o.customerID), itemMenuID:String(li.menuID), itemQuantity:li.quantity };
      await databases.createDocument(databaseId,'orders',ID.unique(),doc);
      console.log(`✅ Inserted order: ${o.orderID}`);
    }catch(e){console.log(`❌ Order ${o.orderID}:`,e.message)}
  }
  // employees
  for(const emp of employees){
    try{ await databases.createDocument(databaseId,'employees',ID.unique(),emp); console.log(`✅ Inserted employee: ${emp.employeeNumber}`);}catch(e){console.log(`❌ Employee ${emp.employeeNumber}:`,e.message)}
  }
  // offices
  for(const off of offices){
    try{ await databases.createDocument(databaseId,'offices',ID.unique(),off); console.log(`✅ Inserted office: ${off.officeCode}`);}catch(e){console.log(`❌ Office ${off.officeCode}:`,e.message)}
  }
  // productlines
  for(const pl of productlines){
    try{ await databases.createDocument(databaseId,'productlines',ID.unique(),pl); console.log(`✅ Inserted productline: ${pl.productLineID}`);}catch(e){console.log(`❌ Productline ${pl.productLineID}:`,e.message)}
  }
  // products
  for(const p of products){
    try{ await databases.createDocument(databaseId,'products',ID.unique(),p); console.log(`✅ Inserted product: ${p.productID}`);}catch(e){console.log(`❌ Product ${p.productID}:`,e.message)}
  }
  // payments
  for(const pay of payments){
    try{ await databases.createDocument(databaseId,'payments',ID.unique(),pay); console.log(`✅ Inserted payment: ${pay.paymentID}`);}catch(e){console.log(`❌ Payment ${pay.paymentID}:`,e.message)}
  }
}
module.exports={insertAll};
