// appwrite_activity_combined.js
// Final Fixed Version — Appwrite v1.7.4 Compatible
// Requirements:
//   npm install node-appwrite@13.0.0 dotenv
// .env must contain APPWRITE_ENDPOINT, APPWRITE_PROJECT, APPWRITE_KEY, DATABASE_ID

require('dotenv').config();
const sdk = require('node-appwrite');
const ID = sdk.ID;

// ==== Load .env variables ====
const endpoint = process.env.APPWRITE_ENDPOINT;
const project = process.env.APPWRITE_PROJECT;
const apiKey = process.env.APPWRITE_KEY;
const databaseId = process.env.DATABASE_ID;

if (!endpoint || !project || !apiKey || !databaseId) {
  console.error('❌ Missing one or more environment variables in .env');
  process.exit(1);
}

// ==== Setup Appwrite Client ====
const client = new sdk.Client()
  .setEndpoint(endpoint)
  .setProject(project)
  .setKey(apiKey);

const databases = new sdk.Databases(client);

// ==== Helper: Recreate flexible (schema-less) collections ====
async function recreateCollections() {
  const collections = ['customers', 'menus', 'orders'];
  for (const col of collections) {
    try {
      await databases.deleteCollection(databaseId, col);
      console.log(`🗑 Deleted old collection: ${col}`);
    } catch (_) {}
    try {
      await databases.createCollection(databaseId, col, col.charAt(0).toUpperCase() + col.slice(1), [], true, true);
      console.log(`✅ Created flexible collection: ${col}`);
    } catch (e) {
      console.error(`⚠️ Could not create collection ${col}:`, e.message);
    }
  }
}

// ==== Helper: Sleep ====
function sleep(ms) {
  return new Promise(res => setTimeout(res, ms));
}

// ==== Helper: Create required attributes for each collection ====
async function createAttributes() {
  // Customers attributes
  try {
    console.log('↗️  Creating customers.customerID');
    await databases.createStringAttribute(databaseId, 'customers', 'customerID', 64, true);
  } catch (e) { console.log('⚠️  customers.customerID:', e.message); }
  try {
    console.log('↗️  Creating customers.lastName');
    await databases.createStringAttribute(databaseId, 'customers', 'lastName', 128, true);
  } catch (e) { console.log('⚠️  customers.lastName:', e.message); }
  try {
    console.log('↗️  Creating customers.firstName');
    await databases.createStringAttribute(databaseId, 'customers', 'firstName', 128, true);
  } catch (e) { console.log('⚠️  customers.firstName:', e.message); }
  try {
    console.log('↗️  Creating customers.contact');
    await databases.createStringAttribute(databaseId, 'customers', 'contact', 64, true);
  } catch (e) { console.log('⚠️  customers.contact:', e.message); }
  try {
    console.log('↗️  Creating customers.address');
    await databases.createStringAttribute(databaseId, 'customers', 'address', 256, true);
  } catch (e) { console.log('⚠️  customers.address:', e.message); }

  // Menus attributes
  try {
    console.log('↗️  Creating menus.menuID');
    await databases.createStringAttribute(databaseId, 'menus', 'menuID', 64, true);
  } catch (e) { console.log('⚠️  menus.menuID:', e.message); }
  try {
    console.log('↗️  Creating menus.menuName');
    await databases.createStringAttribute(databaseId, 'menus', 'menuName', 256, true);
  } catch (e) { console.log('⚠️  menus.menuName:', e.message); }
  try {
    console.log('↗️  Creating menus.price');
    await databases.createIntegerAttribute(databaseId, 'menus', 'price', true);
  } catch (e) { console.log('⚠️  menus.price:', e.message); }
  // Flattened category fields (JSON not supported)
  try {
    console.log('↗️  Creating menus.categoryID');
    await databases.createStringAttribute(databaseId, 'menus', 'categoryID', 64, false);
  } catch (e) { console.log('⚠️  menus.categoryID:', e.message); }
  try {
    console.log('↗️  Creating menus.categoryName');
    await databases.createStringAttribute(databaseId, 'menus', 'categoryName', 128, false);
  } catch (e) { console.log('⚠️  menus.categoryName:', e.message); }

  // Orders attributes
  try {
    console.log('↗️  Creating orders.orderID');
    await databases.createStringAttribute(databaseId, 'orders', 'orderID', 64, true);
  } catch (e) { console.log('⚠️  orders.orderID:', e.message); }
  try {
    if (typeof databases.createDatetimeAttribute === 'function') {
      console.log('↗️  Creating orders.dateOrdered (datetime)');
      await databases.createDatetimeAttribute(databaseId, 'orders', 'dateOrdered', true);
    } else {
      console.log('↗️  Creating orders.dateOrdered (string)');
      await databases.createStringAttribute(databaseId, 'orders', 'dateOrdered', 64, true);
    }
  } catch (e) { console.log('⚠️  orders.dateOrdered:', e.message); }
  // Flattened customer fields (JSON not supported)
  try {
    console.log('↗️  Creating orders.customerID');
    await databases.createStringAttribute(databaseId, 'orders', 'customerID', 64, false);
  } catch (e) { console.log('⚠️  orders.customerID:', e.message); }
  try {
    console.log('↗️  Creating orders.customerFirstName');
    await databases.createStringAttribute(databaseId, 'orders', 'customerFirstName', 128, false);
  } catch (e) { console.log('⚠️  orders.customerFirstName:', e.message); }
  try {
    console.log('↗️  Creating orders.customerLastName');
    await databases.createStringAttribute(databaseId, 'orders', 'customerLastName', 128, false);
  } catch (e) { console.log('⚠️  orders.customerLastName:', e.message); }
  // Flatten first line item fields
  try {
    console.log('↗️  Creating orders.itemMenuID');
    await databases.createStringAttribute(databaseId, 'orders', 'itemMenuID', 64, false);
  } catch (e) { console.log('⚠️  orders.itemMenuID:', e.message); }
  try {
    console.log('↗️  Creating orders.itemMenuName');
    await databases.createStringAttribute(databaseId, 'orders', 'itemMenuName', 256, false);
  } catch (e) { console.log('⚠️  orders.itemMenuName:', e.message); }
  try {
    console.log('↗️  Creating orders.itemQuantity');
    await databases.createIntegerAttribute(databaseId, 'orders', 'itemQuantity', false);
  } catch (e) { console.log('⚠️  orders.itemQuantity:', e.message); }
  try {
    console.log('↗️  Creating orders.itemPriceAtTimeOfOrder');
    await databases.createIntegerAttribute(databaseId, 'orders', 'itemPriceAtTimeOfOrder', false);
  } catch (e) { console.log('⚠️  orders.itemPriceAtTimeOfOrder:', e.message); }
  try {
    console.log('↗️  Creating orders.itemTotalPrice');
    await databases.createIntegerAttribute(databaseId, 'orders', 'itemTotalPrice', false);
  } catch (e) { console.log('⚠️  orders.itemTotalPrice:', e.message); }
  try {
    console.log('↗️  Creating orders.totalAmount');
    await databases.createIntegerAttribute(databaseId, 'orders', 'totalAmount', true);
  } catch (e) { console.log('⚠️  orders.totalAmount:', e.message); }

  // Give Appwrite some time to build attributes (they become Available asynchronously)
  await sleep(2000);
}

// ==== Helper: Wait for attributes to become 'available' ====
async function waitForAttributesAvailable(collectionId, keys, { timeoutMs = 30000, intervalMs = 600 } = {}) {
  const deadline = Date.now() + timeoutMs;
  const pending = new Set(keys);
  while (pending.size > 0) {
    for (const key of Array.from(pending)) {
      try {
        const attr = await databases.getAttribute(databaseId, collectionId, key);
        if (!attr || typeof attr.status !== 'string') continue;
        if (attr.status.toLowerCase() === 'available') {
          console.log(`✅ Attribute available: ${collectionId}.${key}`);
          pending.delete(key);
        } else if (attr.status.toLowerCase() === 'failed') {
          console.log(`❌ Attribute failed: ${collectionId}.${key}`);
          throw new Error(`Attribute ${collectionId}.${key} creation failed`);
        }
      } catch (_) {
        // ignore until deadline; attribute may not be indexed yet
      }
    }
    if (pending.size === 0) break;
    if (Date.now() > deadline) {
      throw new Error(`Timed out waiting for attributes on ${collectionId}: ${Array.from(pending).join(', ')}`);
    }
    await sleep(intervalMs);
  }
}

// ==== Sample Data ====
const customers = [
  { customerID: "1", lastName: "Tokyo", firstName: "Shoji", contact: "080-1234-5678", address: "Kanda, Chiyoda-ku" },
  { customerID: "2", lastName: "Osaka", firstName: "Shokai", contact: "090-9876-5432", address: "Namba, Chuo-ku" },
  { customerID: "3", lastName: "Chugoku", firstName: "Shonen", contact: "070-5555-1234", address: "Hakata, Fukuoka-shi" },
  { customerID: "4", lastName: "Garcia", firstName: "Juan", contact: "091-1111-2222", address: "Quezon City" },
  { customerID: "5", lastName: "Dela Cruz", firstName: "Maria", contact: "092-3333-4444", address: "Caloocan" }
];

const menus = [
  { menuID: "1", menuName: "Sweet and Sour Pork", price: 300, category: { categoryID: "1", categoryName: "Pork" } },
  { menuID: "2", menuName: "Kung Pao Chicken", price: 200, category: { categoryID: "2", categoryName: "Chicken" } },
  { menuID: "3", menuName: "Ma Po Tofu", price: 350, category: { categoryID: "3", categoryName: "Beef" } },
  { menuID: "4", menuName: "Fried Rice", price: 120, category: { categoryID: "4", categoryName: "Rice" } },
  { menuID: "5", menuName: "Spring Roll", price: 80, category: { categoryID: "5", categoryName: "Appetizer" } }
];

const orders = [
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

// ==== Helper: List all docs ====
async function listAll(collectionId) {
  const all = [];
  const limit = 100;
  let offset = 0;
  while (true) {
    try {
      const res = await databases.listDocuments(databaseId, collectionId, [], limit, offset);
      if (!res.documents || res.documents.length === 0) break;
      all.push(...res.documents);
      if (res.documents.length < limit) break;
      offset += res.documents.length;
    } catch (e) {
      console.log(`Error listing ${collectionId}:`, e.message);
      break;
    }
  }
  return all;
}

function isInAugust1999(isoStr) {
  try {
    const d = new Date(isoStr);
    return d.getUTCFullYear() === 1999 && d.getUTCMonth() === 7;
  } catch {
    return false;
  }
}

// ==== Main Script ====
async function main() {
  console.log('== Appwrite Activity Script starting ==');

  try {
    const dbs = await databases.list();
    console.log('✅ Connected to Appwrite. Databases total:', dbs.total);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }

  // Recreate all collections (schema-less)
  await recreateCollections();
  // Create attributes required by our documents
  await createAttributes();
  // Ensure attributes are available before inserting documents
  try {
    await waitForAttributesAvailable('customers', ['customerID', 'lastName', 'firstName', 'contact', 'address']);
  } catch (e) {
    console.log('⚠️ Customers attributes wait warning:', e.message);
  }
  try {
    await waitForAttributesAvailable('menus', ['menuID', 'menuName', 'price', 'categoryID', 'categoryName']);
  } catch (e) {
    console.log('⚠️ Menus attributes wait warning:', e.message);
  }
  try {
    await waitForAttributesAvailable('orders', [
      'orderID', 'dateOrdered', 'totalAmount',
      'customerID', 'customerFirstName', 'customerLastName',
      'itemMenuID', 'itemMenuName', 'itemQuantity', 'itemPriceAtTimeOfOrder', 'itemTotalPrice'
    ]);
  } catch (e) {
    console.log('⚠️ Orders attributes wait warning:', e.message);
  }

  // ==== Insert Customers ====
  for (const c of customers) {
    try {
      const res = await databases.createDocument(databaseId, 'customers', ID.unique(), c);
      console.log(`✅ Inserted customer: ${c.firstName} ${c.lastName}`);
    } catch (e) {
      console.log(`❌ Failed to insert customer ${c.firstName}:`, e.message);
    }
  }

  // ==== Insert Menus (flattened) ====
  for (const m of menus) {
    try {
      const mDoc = { ...m, categoryID: m.category?.categoryID, categoryName: m.category?.categoryName };
      delete mDoc.category;
      const res = await databases.createDocument(databaseId, 'menus', ID.unique(), mDoc);
      console.log(`✅ Inserted menu: ${m.menuName}`);
    } catch (e) {
      console.log(`❌ Failed to insert menu ${m.menuName}:`, e.message);
    }
  }

  // ==== Insert Orders (flattened) ====
  for (const o of orders) {
    try {
      const li = (o.lineItems && o.lineItems[0]) || {};
      const oDoc = {
        orderID: o.orderID,
        dateOrdered: o.dateOrdered,
        customerID: o.customer?.customerID,
        customerFirstName: o.customer?.firstName,
        customerLastName: o.customer?.lastName,
        itemMenuID: li.menuID,
        itemMenuName: li.menuName,
        itemQuantity: li.quantity,
        itemPriceAtTimeOfOrder: li.priceAtTimeOfOrder,
        itemTotalPrice: li.totalPrice,
        totalAmount: o.totalAmount
      };
      const res = await databases.createDocument(databaseId, 'orders', ID.unique(), oDoc);
      console.log(`✅ Inserted order ${o.orderID}`);
    } catch (e) {
      console.log(`❌ Failed to insert order ${o.orderID}:`, e.message);
    }
  }

  // ==== Query 2: Count orders in August 1999 ====
  const allOrders = await listAll('orders');
  const augOrders = allOrders.filter(o => isInAugust1999(o.dateOrdered));
  console.log('\n=== Query 2 (Count): Orders in AUG 1999 ===');
  console.log('Count:', augOrders.length);

  // ==== Query 4: Group by Customer, SUM quantity ====
  const qtyByCustomer = {};
  allOrders.forEach(o => {
    const name = `${o.customerFirstName || ''} ${o.customerLastName || ''}`.trim() || 'Unknown';
    const qty = o.itemQuantity || 0;
    qtyByCustomer[name] = (qtyByCustomer[name] || 0) + qty;
  });
  console.log('\n=== Query 4 (Group/Sum): Total Quantity per Customer ===');
  console.log('Customer | Total Quantity');
  Object.entries(qtyByCustomer).forEach(([name, total]) => console.log(`${name} | ${total}`));

  // ==== Query 5: List Date Ordered + Product Name for August 1999 ====
  console.log('\n=== Query 5: Date Ordered | Product | Quantity (AUG 1999) ===');
  augOrders.forEach(o => {
    console.log(`${o.dateOrdered} | ${o.itemMenuName} | ${o.itemQuantity}`);
  });

  // ==== Query 7: SUM Total Amount for August 1999 ====
  const totalAugAmount = augOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  console.log('\n=== Query 7: SUM Total Amount (AUG 1999) ===');
  console.log('TotalAmount:', totalAugAmount.toFixed(2));

  console.log('\n== ✅ Script finished. Take one screenshot showing results ==');
}

// ==== Run main ====
main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
