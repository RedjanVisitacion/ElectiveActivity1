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

function inAug1999(iso){ try{ const d=new Date(iso); return d.getUTCFullYear()===1999 && d.getUTCMonth()===7; }catch{return false} }

async function runQueries(databases, databaseId){
  // 1. Retrieve orders from August 1999 with projection
  const ordersAll = await listAll(databases, databaseId, 'orders');
  const augRange = ordersAll.filter(o=> inAug1999(o.dateOrdered));
  console.log('\n-- Orders in AUG 1999 (orderID, dateOrdered, customerID, status) --');
  augRange.forEach(o=> console.log(`${o.orderID} | ${o.dateOrdered} | ${o.customerID} | ${o.status}`));

  // 2. Count orders in August 1999
  console.log('\n-- Count Orders in AUG 1999 --');
  console.log('Count:', augRange.length);

  // 3. CustomerFullname, ProductName, QuantityOrdered, PriceEach (join-like)
  const customers = await listAll(databases, databaseId, 'customers');
  const products = await listAll(databases, databaseId, 'products');
  const custById = new Map(customers.map(c=>[String(c.customerID), c]));
  const prodById = new Map(products.map(p=>[String(p.productID), p]));
  console.log('\n-- CustomerFullname | ProductName | QuantityOrdered | PriceEach --');
  ordersAll.forEach(o=>{
    const c=custById.get(String(o.customerID));
    const p=prodById.get(String(o.lineProductID));
    console.log(`${(c?.firstName||'')} ${(c?.lastName||'')} | ${(p?.productName||'')} | ${o.lineQuantityOrdered||0} | ${o.linePriceEach??''}`);
  });

  // 4. Group by CustomerFullname, SUM Total QuantityOrdered
  const qtyByCustomer={};
  ordersAll.forEach(o=>{
    const c=custById.get(String(o.customerID));
    const name=`${c?.firstName||''} ${c?.lastName||''}`.trim()||'Unknown';
    qtyByCustomer[name]=(qtyByCustomer[name]||0)+(o.lineQuantityOrdered||0);
  });
  console.log('\n-- Total Quantity Ordered per Customer --');
  Object.entries(qtyByCustomer).forEach(([n,t])=>console.log(`${n} | ${t}`));

  // 5. DateOrdered, ProductName for orders in Aug 1999
  console.log('\n-- DateOrdered | ProductName (AUG 1999) --');
  augRange.forEach(o=>{
    const p=prodById.get(String(o.lineProductID));
    console.log(`${o.dateOrdered} | ${p?.productName||''}`);
  });

  // 6. TotalAmount per line (quantity * priceEach)
  console.log('\n-- Customer | Product | Qty | Price | TotalAmount --');
  ordersAll.forEach(o=>{
    const c=custById.get(String(o.customerID));
    const p=prodById.get(String(o.lineProductID));
    const total=(o.lineQuantityOrdered||0)*(o.linePriceEach||0);
    console.log(`${(c?.firstName||'')} ${(c?.lastName||'')} | ${(p?.productName||'')} | ${o.lineQuantityOrdered||0} | ${o.linePriceEach||0} | ${total.toFixed(2)}`);
  });

  // 7. SUM Total Amount for August 1999
  const totalAug = augRange.reduce((s,o)=> s + ((o.lineQuantityOrdered||0)*(o.linePriceEach||0)), 0);
  console.log('\n-- SUM TotalAmount (AUG 1999) --');
  console.log('TotalAmountAugustMonth:', totalAug.toFixed(1));
}

module.exports={runQueries};
