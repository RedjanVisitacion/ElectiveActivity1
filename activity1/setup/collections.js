async function recreateCollections(databases, databaseId) {
  const collections = ['customers', 'menus', 'orders'];
  for (const col of collections) {
    try { await databases.deleteCollection(databaseId, col); } catch (_) {}
    await databases.createCollection(
      databaseId,
      col,
      col.charAt(0).toUpperCase() + col.slice(1),
      [],
      true,
      true
    );
    console.log(`✅ Created flexible collection: ${col}`);
  }
}
module.exports = { recreateCollections };
