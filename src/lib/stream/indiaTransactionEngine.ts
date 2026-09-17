/**
 * All-India Retail Transaction Engine & State Stream Service
 * Covers all 28 Indian States & 8 Union Territories with realistic digital transaction density
 */

import { getVerifiedShopForState, VERIFIED_SHOPS } from "@/data/verifiedShops";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { liveEvents } from "@/lib/live-events";

export type IndianRegion = "North" | "South" | "West" | "East" | "Central" | "North-East";

export interface IndianStateMeta {
  code: string;
  name: string;
  gstCode: string;
  region: IndianRegion;
  weight: number; // Probability weight
  tierCities: string[];
}

export type PaymentGatewayType = "Razorpay" | "GooglePay" | "PhonePe" | "Cashfree" | "PayU" | "DirectUPI";

export interface NationalTransaction {
  transaction_id: string;
  timestamp: string;
  amount_inr: number;
  method: string;
  payment_provider: string;
  gateway?: PaymentGatewayType;
  state_code: string;
  state_name: string;
  city: string;
  category: "FMCG & Grocery" | "Quick Commerce" | "Electronics" | "Apparel & Fashion" | "Dining & Cafes";
  customer_name: string;
  is_verified: boolean;
  is_verified_razorpay: boolean;
  verification_badge?: string;
  shop_id: string;
  shop_name?: string;
  shop_gstin?: string;
}

export interface StateMetrics {
  state_code: string;
  state_name: string;
  region: IndianRegion;
  total_volume_inr: number;
  transaction_count: number;
  average_order_value: number;
  top_city: string;
  top_category: string;
  share_pct: number;
}

// All 28 States + 8 Union Territories with realistic digital transaction weights
export const ALL_INDIAN_STATES: IndianStateMeta[] = [
  // --- HIGH DENSITY STATES (~60% of all Indian digital transactions) ---
  {
    code: "MH",
    name: "Maharashtra",
    gstCode: "27",
    region: "West",
    weight: 18,
    tierCities: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane"],
  },
  {
    code: "KA",
    name: "Karnataka",
    gstCode: "29",
    region: "South",
    weight: 14,
    tierCities: ["Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi"],
  },
  {
    code: "DL",
    name: "Delhi NCR",
    gstCode: "07",
    region: "North",
    weight: 11,
    tierCities: ["New Delhi", "South Delhi", "Dwarka", "Rohini", "Connaught Place"],
  },
  {
    code: "TN",
    name: "Tamil Nadu",
    gstCode: "33",
    region: "South",
    weight: 10,
    tierCities: ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
  },
  {
    code: "GJ",
    name: "Gujarat",
    gstCode: "24",
    region: "West",
    weight: 9,
    tierCities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  },
  {
    code: "UP",
    name: "Uttar Pradesh",
    gstCode: "09",
    region: "North",
    weight: 8,
    tierCities: ["Noida", "Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj"],
  },

  // --- MEDIUM DENSITY STATES (~22% of digital transactions) ---
  {
    code: "TG",
    name: "Telangana",
    gstCode: "36",
    region: "South",
    weight: 6.5,
    tierCities: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar"],
  },
  {
    code: "WB",
    name: "West Bengal",
    gstCode: "19",
    region: "East",
    weight: 5.0,
    tierCities: ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"],
  },
  {
    code: "RJ",
    name: "Rajasthan",
    gstCode: "08",
    region: "West",
    weight: 4.5,
    tierCities: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  },
  {
    code: "KL",
    name: "Kerala",
    gstCode: "32",
    region: "South",
    weight: 4.0,
    tierCities: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
  },
  {
    code: "MP",
    name: "Madhya Pradesh",
    gstCode: "23",
    region: "Central",
    weight: 3.5,
    tierCities: ["Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain"],
  },

  // --- EMERGING STATES & UNION TERRITORIES (~18% distributed nationwide) ---
  {
    code: "AP",
    name: "Andhra Pradesh",
    gstCode: "37",
    region: "South",
    weight: 3.0,
    tierCities: ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Nellore"],
  },
  {
    code: "PB",
    name: "Punjab",
    gstCode: "03",
    region: "North",
    weight: 2.5,
    tierCities: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"],
  },
  {
    code: "HR",
    name: "Haryana",
    gstCode: "06",
    region: "North",
    weight: 2.8,
    tierCities: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal"],
  },
  {
    code: "BR",
    name: "Bihar",
    gstCode: "10",
    region: "East",
    weight: 2.2,
    tierCities: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga"],
  },
  {
    code: "OD",
    name: "Odisha",
    gstCode: "21",
    region: "East",
    weight: 2.0,
    tierCities: ["Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Sambalpur"],
  },
  {
    code: "JH",
    name: "Jharkhand",
    gstCode: "20",
    region: "East",
    weight: 1.6,
    tierCities: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar"],
  },
  {
    code: "CG",
    name: "Chhattisgarh",
    gstCode: "22",
    region: "Central",
    weight: 1.5,
    tierCities: ["Raipur", "Bhilai", "Bilaspur", "Korba"],
  },
  {
    code: "AS",
    name: "Assam",
    gstCode: "18",
    region: "North-East",
    weight: 1.5,
    tierCities: ["Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur"],
  },
  {
    code: "UK",
    name: "Uttarakhand",
    gstCode: "05",
    region: "North",
    weight: 1.2,
    tierCities: ["Dehradun", "Haridwar", "Rishikesh", "Haldwani", "Roorkee"],
  },
  {
    code: "HP",
    name: "Himachal Pradesh",
    gstCode: "02",
    region: "North",
    weight: 0.9,
    tierCities: ["Shimla", "Dharamshala", "Mandi", "Solan", "Kullu"],
  },
  {
    code: "GA",
    name: "Goa",
    gstCode: "30",
    region: "West",
    weight: 0.8,
    tierCities: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
  },
  {
    code: "TR",
    name: "Tripura",
    gstCode: "16",
    region: "North-East",
    weight: 0.4,
    tierCities: ["Agartala", "Dharmanagar", "Udaipur"],
  },
  {
    code: "ML",
    name: "Meghalaya",
    gstCode: "17",
    region: "North-East",
    weight: 0.35,
    tierCities: ["Shillong", "Tura", "Jowai"],
  },
  {
    code: "MN",
    name: "Manipur",
    gstCode: "14",
    region: "North-East",
    weight: 0.3,
    tierCities: ["Imphal", "Thoubal", "Churachandpur"],
  },
  {
    code: "NL",
    name: "Nagaland",
    gstCode: "13",
    region: "North-East",
    weight: 0.25,
    tierCities: ["Dimapur", "Kohima", "Mokokchung"],
  },
  {
    code: "MZ",
    name: "Mizoram",
    gstCode: "15",
    region: "North-East",
    weight: 0.2,
    tierCities: ["Aizawl", "Lunglei", "Champhai"],
  },
  {
    code: "AR",
    name: "Arunachal Pradesh",
    gstCode: "12",
    region: "North-East",
    weight: 0.2,
    tierCities: ["Itanagar", "Naharlagun", "Pasighat"],
  },
  {
    code: "SK",
    name: "Sikkim",
    gstCode: "11",
    region: "North-East",
    weight: 0.2,
    tierCities: ["Gangtok", "Namchi", "Gyalshing"],
  },

  // --- UNION TERRITORIES ---
  {
    code: "JK",
    name: "Jammu & Kashmir",
    gstCode: "01",
    region: "North",
    weight: 1.1,
    tierCities: ["Srinagar", "Jammu", "Anantnag", "Baramulla"],
  },
  {
    code: "CH",
    name: "Chandigarh",
    gstCode: "04",
    region: "North",
    weight: 0.9,
    tierCities: ["Chandigarh City", "Manimajra"],
  },
  {
    code: "PY",
    name: "Puducherry",
    gstCode: "34",
    region: "South",
    weight: 0.4,
    tierCities: ["Pondicherry", "Karaikal", "Mahe"],
  },
  {
    code: "LA",
    name: "Ladakh",
    gstCode: "38",
    region: "North",
    weight: 0.2,
    tierCities: ["Leh", "Kargil", "Diskit"],
  },
  {
    code: "AN",
    name: "Andaman & Nicobar",
    gstCode: "35",
    region: "East",
    weight: 0.15,
    tierCities: ["Port Blair", "Havelock", "Diglipur"],
  },
  {
    code: "DN",
    name: "Dadra & Nagar Haveli & Daman & Diu",
    gstCode: "26",
    region: "West",
    weight: 0.2,
    tierCities: ["Daman", "Silvassa", "Diu"],
  },
  {
    code: "LD",
    name: "Lakshadweep",
    gstCode: "31",
    region: "South",
    weight: 0.05,
    tierCities: ["Kavaratti", "Agatti", "Amini"],
  },
];

const INDIAN_CUSTOMER_NAMES = [
  "Aarav Sharma", "Aditi Patel", "Rohan Verma", "Sneha Nair", "Priya Iyer",
  "Vikram Malhotra", "Ananya Deshmukh", "Rahul Sengupta", "Kavya Reddy",
  "Abhishek Rao", "Pooja Hegde", "Arjun Mehra", "Meera Kulkarni", "Karan Joshi",
  "Divya Pillai", "Siddharth Das", "Ishaan Roy", "Tanvi Bhat", "Nikhil Chopra",
  "Sunita Bansal", "Rakesh Gupta", "Deepika Bhatt", "Manish Agrawal", "Swati Chawla"
];

const CATEGORIES: NationalTransaction["category"][] = [
  "Quick Commerce",
  "FMCG & Grocery",
  "Dining & Cafes",
  "Apparel & Fashion",
  "Electronics"
];

const PAYMENT_METHODS = [
  { method: "UPI", provider: "Google Pay", weight: 35 },
  { method: "UPI", provider: "PhonePe", weight: 35 },
  { method: "UPI", provider: "Paytm", weight: 15 },
  { method: "UPI", provider: "BHIM UPI", weight: 5 },
  { method: "Card", provider: "RuPay Debit", weight: 5 },
  { method: "Card", provider: "Visa/Mastercard", weight: 3 },
  { method: "Netbanking", provider: "HDFC / SBI / ICICI", weight: 2 },
];

/**
 * Weighted random selector helper
 */
function pickWeighted<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((acc, item) => acc + item.weight, 0);
  let random = Math.random() * totalWeight;
  for (const item of items) {
    if (random < item.weight) return item;
    random -= item.weight;
  }
  return items[0];
}

/**
 * Realistic retail amount generator (weighted across baskets)
 */
function generateRetailAmount(category: NationalTransaction["category"]): number {
  switch (category) {
    case "Quick Commerce":
      // ₹120 to ₹850
      return Math.round(120 + Math.random() * 730);
    case "Dining & Cafes":
      // ₹180 to ₹2,400
      return Math.round(180 + Math.random() * 2220);
    case "FMCG & Grocery":
      // ₹350 to ₹4,800
      return Math.round(350 + Math.random() * 4450);
    case "Apparel & Fashion":
      // ₹799 to ₹8,500
      return Math.round(799 + Math.random() * 7701);
    case "Electronics":
      // ₹1,499 to ₹24,999
      return Math.round(1499 + Math.random() * 23500);
    default:
      return Math.round(150 + Math.random() * 1500);
  }
}

class IndiaTransactionEngine {
  private transactions: NationalTransaction[] = [];
  private stateTotals: Map<string, { volume: number; count: number }> = new Map();
  private maxBufferSize = 250;
  private isSimulationRunning = true;
  private persistenceInterval: NodeJS.Timeout | null = null;
  private tickerInterval: NodeJS.Timeout | null = null;
  private supabaseClient: SupabaseClient | null = null;
  private supabaseWriteBuffer: Array<{
    id: string;
    amount_inr: number;
    currency: string;
    method: string;
    status: string;
    customer_name: string;
    customer_email: string;
    shop_id: string;
    state_code: string;
    city: string;
    created_at: string;
  }> = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private isFlushing = false;

  constructor() {
    this.seedInitialTransactions();
    this.startContinuousPersistence(3000);
  }

  private seedInitialTransactions() {
    // Seed initial realistic baseline for each state
    const now = Date.now();
    for (let i = 0; i < 45; i++) {
      const state = pickWeighted(ALL_INDIAN_STATES);
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const pay = pickWeighted(PAYMENT_METHODS);
      const amount = generateRetailAmount(category);
      const city = state.tierCities[Math.floor(Math.random() * state.tierCities.length)];
      const customer = INDIAN_CUSTOMER_NAMES[Math.floor(Math.random() * INDIAN_CUSTOMER_NAMES.length)];
      const pastTime = new Date(now - (45 - i) * 60000).toISOString();

      const verifiedShop = getVerifiedShopForState(state.gstCode);
      const tx: NationalTransaction = {
        transaction_id: `tx_in_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
        timestamp: pastTime,
        amount_inr: amount,
        method: pay.method,
        payment_provider: pay.provider,
        gateway: "DirectUPI",
        state_code: state.code,
        state_name: state.name,
        city,
        category,
        customer_name: customer,
        is_verified: false,
        is_verified_razorpay: false,
        shop_id: verifiedShop.shop_id,
        shop_name: verifiedShop.shop_name,
        shop_gstin: verifiedShop.gstin,
      };

      this.recordTransaction(tx);
    }
  }

  private recordTransaction(tx: NationalTransaction) {
    this.transactions.unshift(tx);
    if (this.transactions.length > this.maxBufferSize) {
      this.transactions.pop();
    }

    const current = this.stateTotals.get(tx.state_code) || { volume: 0, count: 0 };
    current.volume += tx.amount_inr;
    current.count += 1;
    this.stateTotals.set(tx.state_code, current);

    // Broadcast in real-time to active SSE subscribers
    try {
      liveEvents.emit("transaction", tx);
    } catch {
      // Non-blocking
    }

    // Queue transaction for persistence into Supabase
    this.queueForSupabase(tx);
  }

  private queueForSupabase(tx: NationalTransaction) {
    // Keep max buffer at 200 to prevent runaway memory usage under network interruption
    if (this.supabaseWriteBuffer.length >= 200) {
      this.supabaseWriteBuffer.shift();
    }

    const customerName = tx.customer_name || "Customer";
    const emailPrefix = customerName.toLowerCase().replace(/[^a-z0-9]/g, ".");
    const emailDomain = ["retail.in", "bharatmail.in", "payflow.in", "quickcart.in"][
      Math.floor(Math.random() * 4)
    ];

    this.supabaseWriteBuffer.push({
      id: tx.transaction_id,
      amount_inr: tx.amount_inr,
      currency: "INR",
      method: (tx.method || "upi").toLowerCase(),
      status: "captured",
      customer_name: customerName,
      customer_email: `${emailPrefix || "customer"}@${emailDomain}`,
      shop_id: tx.shop_id || "IND_SHOP_1001",
      state_code: tx.state_code,
      city: tx.city,
      created_at: tx.timestamp || new Date().toISOString(),
    });
  }

  /**
   * Starts active continuous persistence ticker (running every 2-4 seconds).
   * Continuously produces 1-2 simulated retail transactions across Indian states & payment methods
   * and inserts these generated records into public.live_transactions using the Supabase service role client.
   */
  public startContinuousPersistence(intervalMs = 3000) {
    if (this.persistenceInterval) return;
    this.isSimulationRunning = true;

    this.persistenceInterval = setInterval(async () => {
      if (!this.isSimulationRunning) return;
      try {
        await this.tickAndPersist();
      } catch (err) {
        console.warn("[TransactionEngine] Continuous ticker notice:", err);
      }
    }, intervalMs);

    console.log(`⚡ [TransactionEngine] Continuous persistence ticker active (${intervalMs}ms interval).`);
  }

  public async tickAndPersist(): Promise<void> {
    if (!this.isSimulationRunning) return;

    // Continuously produce 1-2 simulated retail transactions across different Indian states and payment methods
    const count = Math.random() > 0.4 ? 2 : 1;
    for (let i = 0; i < count; i++) {
      this.generateNextTransaction();
    }

    // Persist buffered records into Supabase public.live_transactions
    await this.flushBatchToSupabase();
  }

  public stopContinuousPersistence() {
    if (this.persistenceInterval) {
      clearInterval(this.persistenceInterval);
      this.persistenceInterval = null;
    }
    if (this.tickerInterval) {
      clearInterval(this.tickerInterval);
      this.tickerInterval = null;
    }
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.isSimulationRunning = false;
  }

  public startBatchPersistence() {
    this.startContinuousPersistence(3000);
  }

  public stopBatchPersistence() {
    this.stopContinuousPersistence();
  }

  public startTicker() {
    this.startContinuousPersistence(3000);
  }

  public stopTicker() {
    this.stopContinuousPersistence();
  }

  /**
   * Flushes buffered transactions to public.live_transactions using SUPABASE_SERVICE_ROLE_KEY
   */
  public async flushBatchToSupabase(): Promise<void> {
    if (this.isFlushing) {
      return;
    }

    // Ensure we have transactions in the buffer to persist
    if (this.supabaseWriteBuffer.length === 0) {
      this.generateNextTransaction();
    }

    if (this.supabaseWriteBuffer.length === 0) {
      return;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return;
    }

    this.isFlushing = true;
    // Extract a bounded batch of up to 25 records per flush
    const batch = this.supabaseWriteBuffer.splice(0, 25);

    try {
      if (!this.supabaseClient) {
        this.supabaseClient = createClient(supabaseUrl, serviceRoleKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        });
      }

      const { error } = await this.supabaseClient
        .from("live_transactions")
        .upsert(batch, { onConflict: "id" });

      if (error) {
        console.warn("[TransactionEngine -> Supabase] Batch insert notice:", error.message);
        // Put unpersisted records back at the front of the buffer (up to 15) for graceful retry
        this.supabaseWriteBuffer.unshift(...batch.slice(0, 15));
      } else {
        console.log(`⚡ [TransactionEngine -> Supabase] ✓ Persisted ${batch.length} live transactions into public.live_transactions.`);
      }
    } catch (err) {
      console.warn("[TransactionEngine -> Supabase] Batch persistence exception:", err);
      // Non-blocking: in-memory engine and UI feeds continue without disruption
    } finally {
      this.isFlushing = false;
    }
  }

  /**
   * Produces a single synthetic national transaction based on real Indian weights
   */
  public generateNextTransaction(): NationalTransaction {
    const state = pickWeighted(ALL_INDIAN_STATES);
    const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
    const pay = pickWeighted(PAYMENT_METHODS);
    const amount = generateRetailAmount(category);
    const city = state.tierCities[Math.floor(Math.random() * state.tierCities.length)];
    const customer = INDIAN_CUSTOMER_NAMES[Math.floor(Math.random() * INDIAN_CUSTOMER_NAMES.length)];
    const verifiedShop = getVerifiedShopForState(state.gstCode);

    const tx: NationalTransaction = {
      transaction_id: `tx_${pay.method.toLowerCase()}_${Date.now().toString(36)}_${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      amount_inr: amount,
      method: pay.method,
      payment_provider: pay.provider,
      gateway: "DirectUPI",
      state_code: state.code,
      state_name: state.name,
      city,
      category,
      customer_name: customer,
      is_verified: false,
      is_verified_razorpay: false,
      shop_id: verifiedShop.shop_id,
      shop_name: verifiedShop.shop_name,
      shop_gstin: verifiedShop.gstin,
    };

    this.recordTransaction(tx);
    return tx;
  }

  /**
   * Generalized verified payment injector supporting Razorpay, Google Pay, PhonePe, Cashfree, and PayU
   */
  public injectVerifiedPayment(payload: {
    transaction_id: string;
    amount_inr: number;
    gateway: PaymentGatewayType;
    method: string;
    state_code?: string;
    city?: string;
    customer_name?: string;
    shop_id?: string;
    timestamp?: string;
    category?: NationalTransaction["category"];
  }): NationalTransaction {
    const stateMeta = ALL_INDIAN_STATES.find(
      (s) => s.code === payload.state_code || s.gstCode === payload.state_code
    ) || ALL_INDIAN_STATES[0];

    const providerMap: Record<PaymentGatewayType, string> = {
      Razorpay: `Razorpay (${payload.method.toUpperCase()})`,
      GooglePay: `Google Pay (UPI)`,
      PhonePe: `PhonePe (${payload.method.toUpperCase()})`,
      Cashfree: `Cashfree (${payload.method.toUpperCase()})`,
      PayU: `PayU (${payload.method.toUpperCase()})`,
      DirectUPI: `UPI Direct`,
    };

    const verifiedShop = getVerifiedShopForState(stateMeta.gstCode);

    const verifiedTx: NationalTransaction = {
      transaction_id: payload.transaction_id,
      timestamp: payload.timestamp || new Date().toISOString(),
      amount_inr: payload.amount_inr,
      method: payload.method.toUpperCase(),
      payment_provider: providerMap[payload.gateway] || `${payload.gateway} (${payload.method.toUpperCase()})`,
      gateway: payload.gateway,
      state_code: stateMeta.code,
      state_name: stateMeta.name,
      city: payload.city || stateMeta.tierCities[0],
      category: payload.category || "Quick Commerce",
      customer_name: payload.customer_name || "Verified Customer",
      is_verified: true,
      is_verified_razorpay: payload.gateway === "Razorpay",
      verification_badge: `VERIFIED ${payload.gateway === "GooglePay" ? "GOOGLE PAY" : payload.gateway.toUpperCase()}`,
      shop_id: payload.shop_id || verifiedShop.shop_id,
      shop_name: verifiedShop.shop_name,
      shop_gstin: verifiedShop.gstin,
    };

    this.recordTransaction(verifiedTx);
    return verifiedTx;
  }

  /**
   * Injects a genuine verified Razorpay webhook transaction
   */
  public injectVerifiedRazorpay(payload: {
    transaction_id: string;
    amount_inr: number;
    method: string;
    state_code?: string;
    city?: string;
    customer_name?: string;
    shop_id?: string;
    timestamp?: string;
  }): NationalTransaction {
    return this.injectVerifiedPayment({
      ...payload,
      gateway: "Razorpay",
    });
  }


  public toggleSimulation(active?: boolean): boolean {
    if (typeof active === "boolean") {
      this.isSimulationRunning = active;
    } else {
      this.isSimulationRunning = !this.isSimulationRunning;
    }
    return this.isSimulationRunning;
  }

  public isRunning(): boolean {
    return this.isSimulationRunning;
  }

  /**
   * Returns recent national transactions filtered optionally by state or region
   */
  public getTransactions(limit = 20, stateCode?: string, region?: IndianRegion): NationalTransaction[] {
    let list = this.transactions;

    if (stateCode && stateCode !== "ALL") {
      list = list.filter((t) => t.state_code === stateCode);
    } else if (region) {
      const statesInRegion = new Set(
        ALL_INDIAN_STATES.filter((s) => s.region === region).map((s) => s.code)
      );
      list = list.filter((t) => statesInRegion.has(t.state_code));
    }

    return list.slice(0, limit);
  }

  /**
   * Computes state-by-state breakdown table across all 28 states & 8 UTs
   */
  public getStateBreakdown(regionFilter?: IndianRegion | "ALL"): StateMetrics[] {
    const totalNationalVolume = Array.from(this.stateTotals.values()).reduce(
      (acc, curr) => acc + curr.volume,
      0
    );

    let states = ALL_INDIAN_STATES;
    if (regionFilter && regionFilter !== "ALL") {
      states = states.filter((s) => s.region === regionFilter);
    }

    const breakdown: StateMetrics[] = states.map((s) => {
      const stats = this.stateTotals.get(s.code) || { volume: 0, count: 0 };
      const aov = stats.count > 0 ? Math.round(stats.volume / stats.count) : 0;
      const share = totalNationalVolume > 0
        ? Number(((stats.volume / totalNationalVolume) * 100).toFixed(2))
        : 0;

      return {
        state_code: s.code,
        state_name: s.name,
        region: s.region,
        total_volume_inr: stats.volume,
        transaction_count: stats.count,
        average_order_value: aov,
        top_city: s.tierCities[0] || "Capital City",
        top_category: "Quick Commerce",
        share_pct: share,
      };
    });

    // Sort by volume descending
    return breakdown.sort((a, b) => b.total_volume_inr - a.total_volume_inr);
  }

  /**
   * National or state-level executive summary
   */
  public getOverviewSummary(stateCode?: string, regionFilter?: IndianRegion | "ALL") {
    let filtered = this.transactions;

    if (stateCode && stateCode !== "ALL") {
      filtered = filtered.filter((t) => t.state_code === stateCode);
    } else if (regionFilter && regionFilter !== "ALL") {
      const statesInRegion = new Set(
        ALL_INDIAN_STATES.filter((s) => s.region === regionFilter).map((s) => s.code)
      );
      filtered = filtered.filter((t) => statesInRegion.has(t.state_code));
    }

    const totalRev = filtered.reduce((acc, t) => acc + t.amount_inr, 0);
    const totalCount = filtered.length;
    const aov = totalCount > 0 ? Number((totalRev / totalCount).toFixed(2)) : 0;
    const verifiedRazorpayCount = filtered.filter((t) => t.is_verified_razorpay).length;

    const verifiedShopCount = (stateCode && stateCode !== "ALL")
      ? VERIFIED_SHOPS.filter((s) => s.state_code === stateCode || s.state_name.toLowerCase() === stateCode.toLowerCase()).length || 2
      : VERIFIED_SHOPS.length;

    return {
      total_revenue: totalRev,
      total_transactions: totalCount,
      average_order_value: aov,
      active_shops: verifiedShopCount,
      verified_razorpay_count: verifiedRazorpayCount,
      return_rate_pct: 0,
      yoy_growth_pct: 34.8, // Healthy UPI ecosystem YoY metric
      mom_growth_pct: 12.4,
    };
  }
}

// Global Singleton instance
const globalForStream = global as unknown as {
  indiaTransactionEngine?: IndiaTransactionEngine;
  indiaEnginePersistenceStarted?: boolean;
};

if (
  !globalForStream.indiaTransactionEngine ||
  typeof (globalForStream.indiaTransactionEngine as unknown as Record<string, unknown>).startContinuousPersistence !== "function"
) {
  globalForStream.indiaTransactionEngine = new IndiaTransactionEngine();
}

export const indiaTransactionEngine = globalForStream.indiaTransactionEngine;

if (!globalForStream.indiaEnginePersistenceStarted) {
  globalForStream.indiaEnginePersistenceStarted = true;
  indiaTransactionEngine.startContinuousPersistence(3000);
}
