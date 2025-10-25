function sleep(ms){return new Promise(r=>setTimeout(r,ms));}
async function createAttributes(databases, databaseId){
  // customers (with optional city, country)
  await safe(()=>databases.createStringAttribute(databaseId,'customers','customerID',64,true),'customers.customerID');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','lastName',128,true),'customers.lastName');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','firstName',128,true),'customers.firstName');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','contact',64,true),'customers.contact');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','address',256,true),'customers.address');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','city',128,false),'customers.city');
  await safe(()=>databases.createStringAttribute(databaseId,'customers','country',128,false),'customers.country');
  // menus (categoryName embedded)
  await safe(()=>databases.createStringAttribute(databaseId,'menus','menuID',64,true),'menus.menuID');
  await safe(()=>databases.createStringAttribute(databaseId,'menus','menuName',256,true),'menus.menuName');
  await safe(()=>databases.createIntegerAttribute(databaseId,'menus','price',true),'menus.price');
  await safe(()=>databases.createStringAttribute(databaseId,'menus','categoryName',128,true),'menus.categoryName');
  // orders (customerID + first line item flattened due to JSON limits)
  await safe(()=>databases.createStringAttribute(databaseId,'orders','orderID',64,true),'orders.orderID');
  if (typeof databases.createDatetimeAttribute==='function')
    await safe(()=>databases.createDatetimeAttribute(databaseId,'orders','dateOrdered',true),'orders.dateOrdered');
  else
    await safe(()=>databases.createStringAttribute(databaseId,'orders','dateOrdered',64,true),'orders.dateOrdered');
  await safe(()=>databases.createStringAttribute(databaseId,'orders','customerID',64,true),'orders.customerID');
  await safe(()=>databases.createStringAttribute(databaseId,'orders','itemMenuID',64,false),'orders.itemMenuID');
  await safe(()=>databases.createIntegerAttribute(databaseId,'orders','itemQuantity',false),'orders.itemQuantity');
  // employees
  await safe(()=>databases.createIntegerAttribute(databaseId,'employees','employeeNumber',true),'employees.employeeNumber');
  await safe(()=>databases.createStringAttribute(databaseId,'employees','lastName',128,true),'employees.lastName');
  await safe(()=>databases.createStringAttribute(databaseId,'employees','firstName',128,true),'employees.firstName');
  await safe(()=>databases.createStringAttribute(databaseId,'employees','email',256,true),'employees.email');
  await safe(()=>databases.createStringAttribute(databaseId,'employees','officeCode',64,true),'employees.officeCode');
  await safe(()=>databases.createStringAttribute(databaseId,'employees','jobTitle',128,true),'employees.jobTitle');
  // offices
  await safe(()=>databases.createStringAttribute(databaseId,'offices','officeCode',64,true),'offices.officeCode');
  await safe(()=>databases.createStringAttribute(databaseId,'offices','city',128,true),'offices.city');
  await safe(()=>databases.createStringAttribute(databaseId,'offices','phone',64,true),'offices.phone');
  await safe(()=>databases.createStringAttribute(databaseId,'offices','addressLine',256,true),'offices.addressLine');
  await safe(()=>databases.createStringAttribute(databaseId,'offices','country',128,true),'offices.country');
  await safe(()=>databases.createStringAttribute(databaseId,'offices','postalCode',64,true),'offices.postalCode');
  // productlines
  await safe(()=>databases.createIntegerAttribute(databaseId,'productlines','productLineID',true),'productlines.productLineID');
  await safe(()=>databases.createStringAttribute(databaseId,'productlines','productLine',128,true),'productlines.productLine');
  // products (reference productLineID)
  await safe(()=>databases.createIntegerAttribute(databaseId,'products','productID',true),'products.productID');
  await safe(()=>databases.createStringAttribute(databaseId,'products','productCode',64,true),'products.productCode');
  await safe(()=>databases.createStringAttribute(databaseId,'products','productName',256,true),'products.productName');
  await safe(()=>databases.createIntegerAttribute(databaseId,'products','productLineID',true),'products.productLineID');
  await safe(()=>databases.createStringAttribute(databaseId,'products','productVendor',128,true),'products.productVendor');
  await safe(()=>databases.createIntegerAttribute(databaseId,'products','quantityInStock',true),'products.quantityInStock');
  await safe(()=>databases.createFloatAttribute?databases.createFloatAttribute(databaseId,'products','buyPrice',true):databases.createIntegerAttribute(databaseId,'products','buyPrice',true),'products.buyPrice');
  // payments
  await safe(()=>databases.createIntegerAttribute(databaseId,'payments','paymentID',true),'payments.paymentID');
  await safe(()=>databases.createStringAttribute(databaseId,'payments','orderID',64,true),'payments.orderID');
  if (typeof databases.createDatetimeAttribute==='function')
    await safe(()=>databases.createDatetimeAttribute(databaseId,'payments','paymentDate',true),'payments.paymentDate');
  else
    await safe(()=>databases.createStringAttribute(databaseId,'payments','paymentDate',64,true),'payments.paymentDate');
  await safe(()=>databases.createFloatAttribute?databases.createFloatAttribute(databaseId,'payments','amount',true):databases.createIntegerAttribute(databaseId,'payments','amount',true),'payments.amount');
  await safe(()=>databases.createStringAttribute(databaseId,'payments','remarks',256,false),'payments.remarks');
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
