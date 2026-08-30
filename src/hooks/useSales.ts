"use client";

import { useEffect, useState } from "react";
import type { SalesApiResponse, SalesYear } from "@/types/sales";

interface UseSalesResult {
  data: SalesApiResponse | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useSales(year: SalesYear): UseSalesResult {
  const [data, setData] = useState<SalesApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSales() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/sales?year=${year}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          const body = (await response.json().catch(() => null)) as
            | { error?: string }
            | null;
          throw new Error(body?.error ?? "Unable to load sales data.");
        }

        const payload = (await response.json()) as SalesApiResponse;
        setData(payload);
      } catch (caught) {
        if (caught instanceof DOMException && caught.name === "AbortError") {
          return;
        }

        setData(null);
        setError(
          caught instanceof Error
            ? caught.message
            : "Unable to load sales data.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadSales();

    return () => controller.abort();
  }, [year, reloadToken]);

  return {
    data,
    isLoading,
    error,
    retry: () => setReloadToken((token) => token + 1),
  };
}
