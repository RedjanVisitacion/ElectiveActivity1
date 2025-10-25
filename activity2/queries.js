const { Query } = require('node-appwrite');

async function listAll(databases, databaseId, collectionId){
  const all=[]; let offset=0; const limit=100;
  while(true){
    const res=await databases.listDocuments(databaseId,collectionId,[],limit,offset);
    if(!res.documents||!res.documents.length) break;
    all.push(...res.documents);
    if(res.documents.length<limit) break;
    offset+=res.documents.length;
  }
  return all;
}

async function runQueries(databases, databaseId){
  // Query: Retrieve CustomerID, FirstName, LastName
  const customers = await listAll(databases, databaseId, 'customers');
  console.log('\n-- Customers (customerID, firstName, lastName) --');
  customers.forEach(c=>console.log(`${c.customerID} | ${c.firstName} | ${c.lastName}`));

  // Query: Retrieve CustomerID from orders
  const orders = await listAll(databases, databaseId, 'orders');
  console.log('\n-- Orders (customerID) --');
  orders.forEach(o=>console.log(`${o.orderID} | ${o.customerID}`));

  // Query: Retrieve MenuName and Price
  const menus = await listAll(databases, databaseId, 'menus');
  console.log('\n-- Menus (menuName, price) --');
  menus.forEach(m=>console.log(`${m.menuName} | ${m.price}`));

  // Query: Retrieve MenuID, MenuName, CategoryName, Price
  console.log('\n-- Menus (menuID, menuName, categoryName, price) --');
  menus.forEach(m=>console.log(`${m.menuID} | ${m.menuName} | ${m.categoryName} | ${m.price}`));

  // Query: Retrieve TotalAmount (SUM of menu prices)
  const totalAmount = menus.reduce((s,m)=>s+(m.price||0),0);
  console.log('\n-- SUM of menu prices --');
  console.log('TotalAmount:', totalAmount);

  // Query: Orders where quantity < 4 (using flattened itemQuantity)
  console.log('\n-- Orders with quantity < 4 --');
  orders.filter(o=> (o.itemQuantity||0) < 4)
        .forEach(o=>console.log(`${o.orderID} | ${o.itemMenuID} | ${o.itemQuantity}`));

  // Query: Menus where price between 300 and 350
  console.log('\n-- Menus where price between 300 and 350 --');
  menus.filter(m=> (m.price>=300 && m.price<=350))
       .forEach(m=>console.log(`${m.menuName} | ${m.price}`));

  // Advanced: Join-like projection (orders x menus x customers)
  console.log('\n-- Join-like: customer name, menu name, quantity, price --');
  const menuById = new Map(menus.map(m=>[String(m.menuID), m]));
  const custById = new Map(customers.map(c=>[String(c.customerID), c]));
  orders.forEach(o=>{
    const m = menuById.get(String(o.itemMenuID));
    const c = custById.get(String(o.customerID));
    const price = m?.price ?? null;
    console.log(`${c?.customerID||''} | ${c?.firstName||''} | ${c?.lastName||''} | ${m?.menuName||''} | ${o.itemQuantity||0} | ${price ?? ''}`);
  });
}

module.exports = { runQueries };
