const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const db = new DatabaseSync('./prisma/dev.db');

// State name mapping
const STATE_NAMES = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi NCR",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "25": "Daman & Diu",
  "26": "Dadra & Nagar Haveli",
  "27": "Maharashtra",
  "28": "Andhra Pradesh (Old)",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh"
};

// Fix FAKE_04 if present
const checkFake = db.prepare("SELECT * FROM RegisteredShop WHERE shop_id = 'FAKE_04'").get();
if (checkFake) {
  db.exec("PRAGMA foreign_keys = OFF;");
  db.prepare(`
    UPDATE RegisteredShop 
    SET shop_id = 'IND_SHOP_29_07',
        shop_name = 'Mysore Silk & Sandalwood Emporium',
        category = 'Handicrafts & Heritage',
        is_verified = 1
    WHERE shop_id = 'FAKE_04'
  `).run();
  db.prepare(`
    UPDATE "Transaction"
    SET shop_id = 'IND_SHOP_29_07'
    WHERE shop_id = 'FAKE_04'
  `).run();
  db.exec("PRAGMA foreign_keys = ON;");
  console.log("Upgraded FAKE_04 test entry to IND_SHOP_29_07 (Mysore Silk & Sandalwood Emporium)");
}

// Fetch all verified shops
const shops = db.prepare(`
  SELECT 
    shop_id,
    shop_name,
    gstin,
    state_code,
    pan,
    category,
    is_verified,
    created_at
  FROM RegisteredShop
  ORDER BY state_code ASC, shop_name ASC
`).all();

const enrichedShops = shops.map((s, index) => ({
  serial_no: index + 1,
  shop_id: s.shop_id,
  shop_name: s.shop_name,
  gstin: s.gstin,
  pan: s.pan,
  state_code: s.state_code,
  state_name: STATE_NAMES[s.state_code] || `State ${s.state_code}`,
  category: s.category,
  is_verified: s.is_verified === 1,
  verification_status: "VERIFIED_RETAILER",
  registration_date: s.created_at
}));

console.log(`Total verified shops in database: ${enrichedShops.length}`);

// Write JSON
const outJsonPath = path.join(process.cwd(), 'src', 'data', 'verified_retail_shops.json');
fs.writeFileSync(outJsonPath, JSON.stringify(enrichedShops, null, 2), 'utf8');
console.log(`Exported JSON to ${outJsonPath}`);

// Write CSV
const csvHeaders = ["Serial No", "Shop ID", "Shop Name", "GSTIN", "PAN", "State Code", "State Name", "Category", "Verification Status", "Registered At"];
const csvRows = enrichedShops.map(s => [
  s.serial_no,
  `"${s.shop_id}"`,
  `"${s.shop_name.replace(/"/g, '""')}"`,
  `"${s.gstin}"`,
  `"${s.pan}"`,
  `"${s.state_code}"`,
  `"${s.state_name}"`,
  `"${s.category.replace(/"/g, '""')}"`,
  `"${s.verification_status}"`,
  `"${s.registration_date}"`
].join(','));

const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
const outCsvPath = path.join(process.cwd(), 'src', 'data', 'verified_retail_shops.csv');
fs.writeFileSync(outCsvPath, csvContent, 'utf8');
console.log(`Exported CSV to ${outCsvPath}`);
