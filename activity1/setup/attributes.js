function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function createAttributes(databases, databaseId){
  await safe(()=>databases.createStringAttribute(databaseId,'customers','customerID',64,true),'customers.customerID');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','lastName',128,true),'customers.lastName');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','firstName',128,true),'customers.firstName');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','contact',64,true),'customers.contact');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','address',256,true),'customers.address');
  await safe(()=>databases.createStringAttribute(databaseId,'menus','menuID',64,true),'menus.menuID');
  await safe(()=>databases.createStringAttribute(databaseId,'menus','menuName',256,true),'menus.menuName');
  await safe(()=>databases.createIntegerAttribute(databaseId,'menus','price',true),'menus.price');
  await safe(()=>databases.createStringAttribute(databaseId,'menus','categoryID',64,false),'menus.categoryID');
  await safe(()=>databases.createStringAttribute(databaseId,'menus','categoryName',128,false),'menus.categoryName');
  await safe(()=>databases.createStringAttribute(databaseId,'orders','orderID',64,true),'orders.orderID');
  if (typeof databases.createDatetimeAttribute==='function'){
    await safe(()=>databases.createDatetimeAttribute(databaseId,'orders','dateOrdered',true),'orders.dateOrdered');
  } else {
    await safe(()=>databases.createStringAttribute(databaseId,'orders','dateOrdered',64,true),'orders.dateOrdered');
  }
  await safe(()=>databases.createStringAttribute(databaseId,'orders','customerID',64,false),'orders.customerID');
  await safe(()=>databases.createStringAttribute(databaseId,'orders','customerFirstName',128,false),'orders.customerFirstName');
  await safe(()=>databases.createStringAttribute(databaseId,'orders','customerLastName',128,false),'orders.customerLastName');
  await safe(()=>databases.createStringAttribute(databaseId,'orders','itemMenuID',64,false),'orders.itemMenuID');
  await safe(()=>databases.createStringAttribute(databaseId,'orders','itemMenuName',256,false),'orders.itemMenuName');
  await safe(()=>databases.createIntegerAttribute(databaseId,'orders','itemQuantity',false),'orders.itemQuantity');
  await safe(()=>databases.createIntegerAttribute(databaseId,'orders','itemPriceAtTimeOfOrder',false),'orders.itemPriceAtTimeOfOrder');
  await safe(()=>databases.createIntegerAttribute(databaseId,'orders','itemTotalPrice',false),'orders.itemTotalPrice');
  await safe(()=>databases.createIntegerAttribute(databaseId,'orders','totalAmount',true),'orders.totalAmount');
  await sleep(1000);
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
