"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Award,
  Store,
  Search,
  Filter,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileJson,
  ShieldCheck,
  Building2,
  MapPin,
} from "lucide-react";
import type { ShopLeaderboardItem } from "@/lib/analytics";
import { formatCurrency, formatNumberIN } from "@/lib/utils";
import { VERIFIED_SHOPS, type VerifiedShop } from "@/data/verifiedShops";
import { getStoredUser, User } from "@/lib/auth";

interface ShopLeaderboardProps {
  data: ShopLeaderboardItem[];
  regionName: string;
}

export function ShopLeaderboard({ data, regionName }: ShopLeaderboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"leaderboard" | "verified_all">("leaderboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [stateFilter, setStateFilter] = useState("ALL");

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  // Lookup live revenue mapped by shop_id
  const liveRevenueByShopId = useMemo(() => {
    const map = new Map<string, { revenue: number; orders: number }>();
    if (data && data.length > 0) {
      data.forEach((d) => {
        map.set(d.shop_id, { revenue: d.revenue, orders: d.orders });
      });
    }
    return map;
  }, [data]);

  // Categories for Leaderboard Tab
  const leaderboardCategories = useMemo(() => {
    return ["ALL", ...Array.from(new Set(data.map((s) => s.category)))];
  }, [data]);

  // Categories for All Verified Shops Tab
  const allVerifiedCategories = useMemo(() => {
    return ["ALL", ...Array.from(new Set(VERIFIED_SHOPS.map((s) => s.category)))].sort();
  }, []);

  // States list for filtering
  const allVerifiedStates = useMemo(() => {
    return ["ALL", ...Array.from(new Set(VERIFIED_SHOPS.map((s) => s.state_name)))].sort();
  }, []);

  // Filtered leaderboard
  const filteredLeaderboard = useMemo(() => {
    return data.filter((s) => {
      const matchesSearch =
        s.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shop_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "ALL" || s.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [data, searchTerm, categoryFilter]);

  // Filtered All Verified Shops
  const filteredVerifiedShops = useMemo(() => {
    return VERIFIED_SHOPS.filter((s) => {
      const matchesSearch =
        s.shop_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.pan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.state_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.shop_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "ALL" || s.category === categoryFilter;
      const matchesState = stateFilter === "ALL" || s.state_name === stateFilter;
      return matchesSearch && matchesCategory && matchesState;
    });
  }, [searchTerm, categoryFilter, stateFilter]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-950/60 border-emerald-500/40";
    if (score >= 60) return "text-amber-400 bg-amber-950/60 border-amber-500/40";
    return "text-rose-400 bg-rose-950/60 border-rose-500/40";
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl backdrop-blur-md">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {activeTab === "leaderboard" ? <Award className="h-5 w-5" /> : <ShieldCheck className="h-5 w-5 text-emerald-400" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {activeTab === "leaderboard" ? "Merchant Performance Leaderboard" : "Verified Retail Merchant Network"}
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#4E9B8F]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#4E9B8F] border border-[#4E9B8F]/30">
                <CheckCircle2 className="h-3 w-3" /> 78 Verified Stores
              </span>
            </div>
            <p className="text-xs text-[#8A949E]">
              {activeTab === "leaderboard"
                ? `Ranked by verified live volume & order count • ${regionName}`
                : "Authenticated retail stores with valid GSTIN across all 28 Indian States & 8 UTs"}
            </p>
          </div>
        </div>

        {/* Tab Switcher & Export Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex rounded-xl bg-[#0A0E12] p-1 border border-[#222E3A]">
            <button
              onClick={() => {
                setActiveTab("leaderboard");
                setCategoryFilter("ALL");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "leaderboard"
                  ? "bg-[#D9A15B]/20 text-[#D9A15B] shadow-sm border border-[#D9A15B]/40"
                  : "text-[#8A949E] hover:text-[#EDE6D9]"
              }`}
            >
              🏆 Top Performers
            </button>
            <button
              onClick={() => {
                setActiveTab("verified_all");
                setCategoryFilter("ALL");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "verified_all"
                  ? "bg-[#4E9B8F]/20 text-[#4E9B8F] shadow-sm border border-[#4E9B8F]/40"
                  : "text-[#8A949E] hover:text-[#EDE6D9]"
              }`}
            >
              🏪 All Verified Shops (78)
            </button>
          </div>

          {/* Export Buttons */}
          <div className="flex items-center gap-1.5">
            <a
              href="/api/analytics/shops?format=csv"
              download="verified_retail_shops.csv"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#2A3745] bg-[#161E26] px-3 py-1.5 text-xs font-semibold text-[#EDE6D9] hover:bg-[#1E2934] hover:border-[#D9A15B]/40 hover:text-[#D9A15B] transition-all shadow-sm"
              title="Download full verified retail shops dataset as CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-[#D9A15B]" />
              CSV
            </a>
            <a
              href="/api/analytics/shops?format=json"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[#2A3745] bg-[#161E26] px-3 py-1.5 text-xs font-semibold text-[#EDE6D9] hover:bg-[#1E2934] hover:border-[#4E9B8F]/40 hover:text-[#4E9B8F] transition-all shadow-sm"
              title="View/Download JSON API data"
            >
              <FileJson className="h-3.5 w-3.5 text-[#4E9B8F]" />
              JSON
            </a>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-[#0A0E12]/60 p-3 rounded-xl border border-[#222E3A]">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8A949E]" />
          <input
            type="text"
            placeholder={
              activeTab === "leaderboard"
                ? "Search merchant, GSTIN, or state..."
                : "Search any store, GSTIN, PAN, state, or category..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-slate-800 bg-slate-900 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* State filter in verified shops mode */}
          {activeTab === "verified_all" && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={stateFilter}
                onChange={(e) => setStateFilter(e.target.value)}
                aria-label="Filter by state"
                className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
              >
                <option value="ALL">All States / UTs (36)</option>
                {allVerifiedStates.filter((s) => s !== "ALL").map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Category filter */}
          <div className="flex items-center gap-1">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
            >
              {(activeTab === "leaderboard" ? leaderboardCategories : allVerifiedCategories).map((c) => (
                <option key={c} value={c}>
                  {c === "ALL" ? "All Categories" : c}
                </option>
              ))}
            </select>
          </div>

          <span className="text-[11px] text-slate-400 font-medium pl-1">
            Showing{" "}
            <span className="text-white font-semibold">
              {activeTab === "leaderboard" ? filteredLeaderboard.length : filteredVerifiedShops.length}
            </span>{" "}
            stores
          </span>
        </div>
      </div>

      {/* View 1: Active Leaderboard Table */}
      {activeTab === "leaderboard" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <tr>
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Merchant</th>
                <th className="py-2.5 px-3">State & Tax ID</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Revenue (INR)</th>
                <th className="py-2.5 px-3 text-right">Orders</th>
                <th className="py-2.5 px-3 text-center">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLeaderboard.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No merchants match the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredLeaderboard.map((shop, idx) => (
                  <tr key={shop.shop_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-400">
                      {idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : `#${idx + 1}`}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-white">{shop.shop_name}</span>
                        <span title="Verified Merchant by GSTIN">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{shop.shop_id}</span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <span className="text-slate-300 font-medium">{shop.state_name}</span>
                        <span className="font-mono text-[10px] text-slate-500 tracking-wider">
                          {shop.gstin}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-400">{shop.category}</td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-white">
                      {formatCurrency(shop.revenue)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {formatNumberIN(shop.orders)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${getScoreColor(
                          shop.performance_score
                        )}`}
                      >
                        ★ {shop.performance_score} / 100
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View 2: All Verified Retail Shops Directory */}
      {activeTab === "verified_all" && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Shop ID</th>
                <th className="py-2.5 px-3">Registered Retail Store</th>
                <th className="py-2.5 px-3">State & Code</th>
                <th className="py-2.5 px-3">GSTIN / PAN</th>
                <th className="py-2.5 px-3">Business Category</th>
                <th className="py-2.5 px-3 text-center">Verification</th>
                <th className="py-2.5 px-3 text-right">Live Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredVerifiedShops.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No verified stores match the search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredVerifiedShops.map((shop, idx) => {
                  const liveStats = liveRevenueByShopId.get(shop.shop_id);
                  return (
                    <tr key={shop.shop_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">
                        {shop.serial_no || idx + 1}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-xs font-semibold text-emerald-400">
                        {shop.shop_id}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <Store className="h-3.5 w-3.5 text-amber-400/80 shrink-0" />
                          <span className="font-semibold text-white">{shop.shop_name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-300 font-medium">{shop.state_name}</span>
                          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                            {shop.state_code}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-col">
                          <span className="font-mono text-[11px] text-emerald-300 tracking-wider">
                            {shop.gstin}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500">
                            PAN: {user ? shop.pan : "••••••••••"}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{shop.category}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                          <CheckCircle2 className="h-2.5 w-2.5" /> VERIFIED
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        {liveStats && liveStats.revenue > 0 ? (
                          <div className="flex flex-col items-end">
                            <span className="font-mono font-semibold text-white">
                              {formatCurrency(liveStats.revenue)}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {liveStats.orders} orders
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic font-mono">
                            Active Merchant
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer Info Pill */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-slate-400" />
          <span>All 78 merchants are certified Indian retail entities mapped to GST State Codes (01 to 38).</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Active Ingestion: <strong className="text-slate-300">Razorpay, Google Pay, PhonePe, Cashfree, PayU</strong></span>
        </div>
      </div>
    </div>
  );
}
