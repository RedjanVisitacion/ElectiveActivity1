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
function isInAugust1999(iso){
  try{const d=new Date(iso);return d.getUTCFullYear()===1999&&d.getUTCMonth()===7;}catch{return false}
}
async function runQueries(databases, databaseId){
  const allOrders=await listAll(databases,databaseId,'orders');
  const augOrders=allOrders.filter(o=>isInAugust1999(o.dateOrdered));
  console.log('\n=== Query 2 (Count): Orders in AUG 1999 ===');
  console.log('Count:',augOrders.length);

  const qtyByCustomer={};
  allOrders.forEach(o=>{
    const name=`${o.customerFirstName||''} ${o.customerLastName||''}`.trim()||'Unknown';
    const qty=o.itemQuantity||0; qtyByCustomer[name]=(qtyByCustomer[name]||0)+qty;
  });
  console.log('\n=== Query 4 (Group/Sum): Total Quantity per Customer ===');
  console.log('Customer | Total Quantity');
  Object.entries(qtyByCustomer).forEach(([n,t])=>console.log(`${n} | ${t}`));

  console.log('\n=== Query 5: Date Ordered | Product | Quantity (AUG 1999) ===');
  augOrders.forEach(o=>{ console.log(`${o.dateOrdered} | ${o.itemMenuName} | ${o.itemQuantity}`); });

  const totalAugAmount=augOrders.reduce((s,o)=>s+(o.totalAmount||0),0);
  console.log('\n=== Query 7: SUM Total Amount (AUG 1999) ===');
  console.log('TotalAmount:',totalAugAmount.toFixed(2));
}
module.exports={runQueries};
