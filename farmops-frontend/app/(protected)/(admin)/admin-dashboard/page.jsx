"use client";

import React, { useEffect, useState } from "react";
import { MyHook } from "@/context/AppProvider";
import { getAdminStats } from "@/services/adminApi";
import PlatformStats from "@/components/admin/PlatformStats";
import UserTable from "@/components/admin/UserTable";

export default function AdminDashboardPage() {
  const { authToken, authUser } = MyHook();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!authToken) return;
    setStatsLoading(true);
    getAdminStats(authToken)
      .then((res) => {
        if (res.success) setStats(res.data);
      })
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, [authToken]);

  return (
    <div className="space-y-2">
      {/* Page header */}
      <div className="py-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back,{" "}
          <span className="font-medium text-green-600">{authUser?.name}</span>.
          Manage users and monitor platform activity.
        </p>
      </div>

      {/* Platform stats */}
      <PlatformStats stats={stats} loading={statsLoading} />

      {/* Users section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          User Management
        </h2>
        <UserTable />
      </div>
    </div>
  );
}
