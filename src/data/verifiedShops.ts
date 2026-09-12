/**
 * Verified Indian Retail Shops Network
 * Comprehensive dataset of 78 registered and verified retail merchants across all 28 Indian states & 8 Union Territories.
 */

export interface VerifiedShop {
  serial_no: number;
  shop_id: string;
  shop_name: string;
  gstin: string;
  pan: string;
  state_code: string;
  state_name: string;
  category: string;
  is_verified: boolean;
  verification_status: "VERIFIED_RETAILER";
  registration_date: string;
}

import verifiedShopsData from "./verified_retail_shops.json";

export const VERIFIED_SHOPS: VerifiedShop[] = verifiedShopsData as VerifiedShop[];

/**
 * Fast lookup map by shop_id
 */
export const VERIFIED_SHOP_MAP: Record<string, VerifiedShop> = VERIFIED_SHOPS.reduce(
  (acc, shop) => {
    acc[shop.shop_id] = shop;
    return acc;
  },
  {} as Record<string, VerifiedShop>
);

/**
 * Group verified shops by 2-digit GST state code
 */
export const VERIFIED_SHOPS_BY_STATE: Record<string, VerifiedShop[]> = VERIFIED_SHOPS.reduce(
  (acc, shop) => {
    if (!acc[shop.state_code]) {
      acc[shop.state_code] = [];
    }
    acc[shop.state_code].push(shop);
    return acc;
  },
  {} as Record<string, VerifiedShop[]>
);

/**
 * Helper to get a random verified shop for a given state, or fallback to any verified shop
 */
export function getVerifiedShopForState(stateCode: string): VerifiedShop {
  const stateShops = VERIFIED_SHOPS_BY_STATE[stateCode];
  if (stateShops && stateShops.length > 0) {
    return stateShops[Math.floor(Math.random() * stateShops.length)];
  }
  return VERIFIED_SHOPS[Math.floor(Math.random() * VERIFIED_SHOPS.length)];
}
