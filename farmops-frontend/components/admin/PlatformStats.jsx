"use client";

import React from "react";
import { Users, Ban, Tractor, TrendingDown, TrendingUp } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const STAT_CARDS = [
  {
    key: "total_users",
    label: "Total Users",
    icon: Users,
    colorClass: "text-blue-600",
    bgClass: "bg-blue-50",
  },
  {
    key: "suspended_users",
    label: "Suspended Users",
    icon: Ban,
    colorClass: "text-yellow-600",
    bgClass: "bg-yellow-50",
  },
  {
    key: "total_farms",
    label: "Total Farms",
    icon: Tractor,
    colorClass: "text-green-600",
    bgClass: "bg-green-50",
  },
  {
    key: "total_expenses",
    label: "Total Expenses",
    icon: TrendingDown,
    colorClass: "text-red-500",
    bgClass: "bg-red-50",
    currency: true,
  },
  {
    key: "total_income",
    label: "Total Income",
    icon: TrendingUp,
    colorClass: "text-green-600",
    bgClass: "bg-green-50",
    currency: true,
  },
];

export default function PlatformStats({ stats, loading }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 py-8">
      {STAT_CARDS.map(
        ({ key, label, icon: Icon, colorClass, bgClass, currency }) => (
          <div
            key={key}
            className="w-full bg-white shadow-lg border border-white/20 rounded-2xl flex flex-col justify-center items-center gap-2 py-5 px-3"
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${bgClass}`}
            >
              <Icon className={`w-5 h-5 ${colorClass}`} />
            </div>
            <p className="text-sm font-semibold text-gray-600 text-center">
              {label}
            </p>
            {loading ? (
              <Spinner className="size-6" />
            ) : (
              <p className={`text-xl font-bold ${colorClass}`}>
                {currency ? "₹" : ""}
                {stats?.[key] ?? "—"}
              </p>
            )}
          </div>
        ),
      )}
    </div>
  );
}
