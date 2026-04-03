"use client";

import React from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  Ban,
  Calendar,
  Tractor,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function UserDetailModal({ user, loading, onClose }) {
  if (!user && !loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner className="size-8" />
            </div>
          ) : (
            <div className="space-y-4">
              {/* Status badge */}
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    user.is_suspended
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.is_suspended ? (
                    <>
                      <Ban className="w-3 h-3" /> Suspended
                    </>
                  ) : (
                    <>
                      <Shield className="w-3 h-3" /> Active
                    </>
                  )}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                  {user.role === "admin" ? "Admin" : "User"}
                </span>
              </div>

              {/* Info rows */}
              {[
                { icon: User, label: "Name", value: user.name },
                { icon: Mail, label: "Email", value: user.email },
                { icon: Phone, label: "Mobile", value: user.mobile || "—" },
                {
                  icon: Calendar,
                  label: "Registered",
                  value: new Date(user.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }),
                },
                {
                  icon: Tractor,
                  label: "Farms",
                  value: user.farms_count ?? "—",
                },
                {
                  icon: TrendingDown,
                  label: "Total Expenses",
                  value:
                    user.total_expenses != null
                      ? `₹${user.total_expenses}`
                      : "—",
                },
                {
                  icon: TrendingUp,
                  label: "Total Income",
                  value:
                    user.total_income != null ? `₹${user.total_income}` : "—",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium text-gray-800">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2.5 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
