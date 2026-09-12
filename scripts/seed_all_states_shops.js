const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('./prisma/dev.db');

const additionalVerifiedShops = [
  {
    shop_id: "IND_SHOP_01_01",
    shop_name: "Srinagar Pashmina & Woolen Crafts",
    gstin: "01ABCDE2345K1Z2",
    state_code: "01",
    pan: "ABCDE2345K",
    category: "Apparel & Handicrafts",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_02_01",
    shop_name: "Shimla Apple Valley Agro Hub",
    gstin: "02BCDEF3456L1Z4",
    state_code: "02",
    pan: "BCDEF3456L",
    category: "Agro & Food Processing",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_04_01",
    shop_name: "Chandigarh Digital Retail Plaza",
    gstin: "04CDEFG4567M1Z6",
    state_code: "04",
    pan: "CDEFG4567M",
    category: "Electronics & Gadgets",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_05_01",
    shop_name: "Dehradun Himalayan Organics",
    gstin: "05DEFGH5678N1Z8",
    state_code: "05",
    pan: "DEFGH5678N",
    category: "Organic Foods & Wellness",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_11_01",
    shop_name: "Gangtok Organic Tea & Spices",
    gstin: "11EFGHI6789O1ZA",
    state_code: "11",
    pan: "EFGHI6789O",
    category: "Organic Food & Beverages",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_12_01",
    shop_name: "Itanagar Cane & Bamboo Emporium",
    gstin: "12FGHIJ7890P1ZC",
    state_code: "12",
    pan: "FGHIJ7890P",
    category: "Handicrafts & Decor",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_13_01",
    shop_name: "Kohima Traditional Weaves",
    gstin: "13GHIJK8901Q1ZE",
    state_code: "13",
    pan: "GHIJK8901Q",
    category: "Textiles & Handlooms",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_14_01",
    shop_name: "Imphal Silk & Handloom Society",
    gstin: "14HIJKL9012R1ZG",
    state_code: "14",
    pan: "HIJKL9012R",
    category: "Textiles & Silks",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_15_01",
    shop_name: "Aizawl Hill Agro & Crafts",
    gstin: "15IJKLM0123S1ZI",
    state_code: "15",
    pan: "IJKLM0123S",
    category: "Agro & Bamboo Goods",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_16_01",
    shop_name: "Agartala Bamboo & Cane Works",
    gstin: "16JKLMN1234T1ZK",
    state_code: "16",
    pan: "JKLMN1234T",
    category: "Handicrafts & Furniture",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_17_01",
    shop_name: "Shillong Cloud Spices & Botanicals",
    gstin: "17KLMNO2345U1ZM",
    state_code: "17",
    pan: "KLMNO2345U",
    category: "Spices & Natural Herbs",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_18_01",
    shop_name: "Guwahati Brahmaputra Tea Traders",
    gstin: "18LMNOP3456V1ZO",
    state_code: "18",
    pan: "LMNOP3456V",
    category: "Tea & Plantation Exports",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_18_02",
    shop_name: "Assam Silk & Eri Muga Hub",
    gstin: "18MNOPQ4567W1ZQ",
    state_code: "18",
    pan: "MNOPQ4567W",
    category: "Luxury Silks & Garments",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_20_01",
    shop_name: "Ranchi Mineral & Tool Supplies",
    gstin: "20NOPQR5678X1ZS",
    state_code: "20",
    pan: "NOPQR5678X",
    category: "Industrial Tools & Hardware",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_26_01",
    shop_name: "Daman Coastal Trading & Retail",
    gstin: "26OPQRS6789Y1ZU",
    state_code: "26",
    pan: "OPQRS6789Y",
    category: "Consumer Retail & FMCG",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_31_01",
    shop_name: "Kavaratti Island Fishery & Organics",
    gstin: "31PQRST7890Z1ZW",
    state_code: "31",
    pan: "PQRST7890Z",
    category: "Fisheries & Marine Organics",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_34_01",
    shop_name: "French Quarter Lifestyle & Bakery Pondy",
    gstin: "34QRSTU8901A1ZY",
    state_code: "34",
    pan: "QRSTU8901A",
    category: "Gourmet Foods & Dining",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_35_01",
    shop_name: "Port Blair Island Crafts & Spices",
    gstin: "35RSTUV9012B1Z1",
    state_code: "35",
    pan: "RSTUV9012B",
    category: "Spices & Island Handicrafts",
    is_verified: 1
  },
  {
    shop_id: "IND_SHOP_38_01",
    shop_name: "Leh Pashmina & Highland Organics",
    gstin: "38STUVW0123C1Z3",
    state_code: "38",
    pan: "STUVW0123C",
    category: "Luxury Pashmina & Woolens",
    is_verified: 1
  }
];

const insertStmt = db.prepare(`
  INSERT OR IGNORE INTO RegisteredShop (shop_id, shop_name, gstin, state_code, pan, category, is_verified, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
`);

let added = 0;
for (const shop of additionalVerifiedShops) {
  const result = insertStmt.run(
    shop.shop_id,
    shop.shop_name,
    shop.gstin,
    shop.state_code,
    shop.pan,
    shop.category,
    shop.is_verified
  );
  if (result.changes > 0) {
    added++;
  }
}

console.log(`Successfully added ${added} verified shops covering all remaining Indian states and UTs.`);

const count = db.prepare("SELECT count(*) as total FROM RegisteredShop WHERE is_verified = 1").get();
console.log(`Total verified retail shops now in database: ${count.total}`);
