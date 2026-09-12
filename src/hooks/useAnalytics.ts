"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type {
  AnalyticsSummary,
  MonthlySalesPoint,
  StateDistribution,
  ShopLeaderboardItem,
} from "@/lib/analytics";

export interface AnalyticsState {
  summary: AnalyticsSummary | null;
  monthly: MonthlySalesPoint[];
  geoDistribution: StateDistribution[];
  leaderboard: ShopLeaderboardItem[];
  regionName: string;
  isLoading: boolean;
  isLiveUpdating: boolean;
  error: string | null;
}

export function useAnalytics(selectedState = "ALL", dateRange = "2y") {
  const [state, setState] = useState<AnalyticsState>({
    summary: null,
    monthly: [],
    geoDistribution: [],
    leaderboard: [],
    regionName: "All Markets",
    isLoading: true,
    isLiveUpdating: false,
    error: null,
  });

  const [refreshIndex, setRefreshIndex] = useState(0);
  const prevRevRef = useRef<number | null>(null);

  const refetch = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  const fetchData = useCallback(
    async (isInitial = false) => {
      if (isInitial) {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
      }

      try {
        const [overviewRes, monthlyRes, geoRes, leaderboardRes] = await Promise.all([
          fetch(
            `/api/analytics/overview?state=${encodeURIComponent(
              selectedState
            )}&dateRange=${encodeURIComponent(dateRange)}`
          ),
          fetch(
            `/api/analytics/monthly?state=${encodeURIComponent(
              selectedState
            )}&dateRange=${encodeURIComponent(dateRange)}`
          ),
          fetch(`/api/analytics/geo-distribution`),
          fetch(
            `/api/analytics/shops/leaderboard?state=${encodeURIComponent(
              selectedState
            )}&limit=100`
          ),
        ]);

        if (!overviewRes.ok || !monthlyRes.ok) {
          throw new Error("Failed to load analytics engine data");
        }

        const overviewJson = await overviewRes.json();
        const monthlyJson = await monthlyRes.json();
        const geoJson = await geoRes.json();
        const leaderboardJson = await leaderboardRes.json();

        const currentRev = overviewJson.data?.total_revenue;
        const hasChanged =
          prevRevRef.current !== null &&
          currentRev !== undefined &&
          currentRev !== prevRevRef.current;

        prevRevRef.current = currentRev;

        setState({
          summary: overviewJson.data || null,
          monthly: monthlyJson.data || [],
          geoDistribution: geoJson.data || [],
          leaderboard: leaderboardJson.data || [],
          regionName: overviewJson.region || "All Markets",
          isLoading: false,
          isLiveUpdating: hasChanged,
          error: null,
        });

        // Reset visual highlight after 1.5 seconds
        if (hasChanged) {
          setTimeout(() => {
            setState((prev) => ({ ...prev, isLiveUpdating: false }));
          }, 1500);
        }
      } catch (err: unknown) {
        if (isInitial) {
          setState((prev) => ({
            ...prev,
            isLoading: false,
            error: err instanceof Error ? err.message : "Error fetching analytics data",
          }));
        }
      }
    },
    [selectedState, dateRange]
  );

  // Initial fetch and change triggers
  useEffect(() => {
    fetchData(true);
  }, [fetchData, refreshIndex]);

  // Option B: Server-Sent Events (SSE) Stream Listener
  useEffect(() => {
    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource("/api/analytics/stream");

      eventSource.addEventListener("transaction", () => {
        // Immediate background refresh on live webhook push
        fetchData(false);
      });

      eventSource.onerror = () => {
        // Close on error; background polling will handle fallbacks
        eventSource?.close();
      };
    } catch {
      // SSE unsupported or network block
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [fetchData]);

  // Option A: Clean 2.5s auto-polling fallback (Zero-flicker background fetch)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      fetchData(false);
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [fetchData]);

  return { ...state, refetch };
}
