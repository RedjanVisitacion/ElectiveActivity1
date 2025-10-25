function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function createAttributes(databases, databaseId){
  // customers
  await safe(()=>databases.createStringAttribute(databaseId,'customers','customerID',64,true),'customers.customerID');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','lastName',128,true),'customers.lastName');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','firstName',128,true),'customers.firstName');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','contact',64,true),'customers.contact');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','city',128,true),'customers.city');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','country',128,true),'customers.country');
  // products
  await safe(()=>databases.createStringAttribute(databaseId,'products','productID',64,true),'products.productID');
  await safe(()=>databases.createStringAttribute(databaseId,'products','productName',256,true),'products.productName');
  // orders (high denormalization, flattened first line item)
  await safe(()=>databases.createStringAttribute(databaseId,'orders','orderID',64,true),'orders.orderID');
  if (typeof databases.createDatetimeAttribute==='function'){
    await safe(()=>databases.createDatetimeAttribute(databaseId,'orders','dateOrdered',true),'orders.dateOrdered');
    await safe(()=>databases.createDatetimeAttribute(databaseId,'orders','shippedDate',true),'orders.shippedDate');
  } else {
    await safe(()=>databases.createStringAttribute(databaseId,'orders','dateOrdered',64,true),'orders.dateOrdered');
    await safe(()=>databases.createStringAttribute(databaseId,'orders','shippedDate',64,true),'orders.shippedDate');
  }
  await safe(()=>databases.createStringAttribute(databaseId,'orders','status',64,true),'orders.status');
  await safe(()=>databases.createStringAttribute(databaseId,'orders','customerID',64,true),'orders.customerID');
  await safe(()=>databases.createStringAttribute(databaseId,'orders','lineProductID',64,true),'orders.lineProductID');
  await safe(()=>databases.createIntegerAttribute(databaseId,'orders','lineQuantityOrdered',true),'orders.lineQuantityOrdered');
  // priceEach as float if available, else integer
  if (typeof databases.createFloatAttribute==='function'){
    await safe(()=>databases.createFloatAttribute(databaseId,'orders','linePriceEach',true),'orders.linePriceEach');
  } else {
    await safe(()=>databases.createIntegerAttribute(databaseId,'orders','linePriceEach',true),'orders.linePriceEach');
  }
  await sleep(1200);
}
async function waitForAttributesAvailable(databases, databaseId, collectionId, keys,{timeoutMs=30000,intervalMs=600}={}){
  const deadline=Date.now()+timeoutMs; const pending=new Set(keys);
  while(pending.size){
    for(const key of Array.from(pending)){
      try{
        const a=await databases.getAttribute(databaseId,collectionId,key);
        if(a && typeof a.status==='string'){
          const s=a.status.toLowerCase();
          if(s==='available') pending.delete(key);
          else if(s==='failed') throw new Error(`${collectionId}.${key} failed`);
        }
      }catch(_){ }
    }
    if(!pending.size) break;
    if(Date.now()>deadline) throw new Error(`Timed out waiting for ${collectionId}: ${Array.from(pending).join(', ')}`);
    await sleep(intervalMs);
  }
}
async function safe(fn,label){try{console.log('↗️  Creating',label);await fn();}catch(e){console.log('⚠️ ',label+':',e.message);} }
module.exports={createAttributes,waitForAttributesAvailable};
