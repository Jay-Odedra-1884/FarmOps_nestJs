"use client";

import React from "react";
import { MyHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, LogOut, Sprout } from "lucide-react";


export default function AdminSidebar() {
  const { logout } = MyHook();
  const router = useRouter();

  return (
    <div className="bg-white h-full rounded-tr-none rounded-2xl p-5 flex flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
          <Sprout className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">FarmOps</p>
          <p className="text-xs text-green-600 font-medium">Admin Panel</p>
        </div>
      </div>

      <div className="w-full flex flex-col justify-between items-center">
        <h1 className="text-7xl font-bold text-green-100">FarmOps</h1>
        <p className="text-xl mt-5 font-bold text-gray-200">Manage farms,<br /> Monitor operations,<br /> and <br /> Keep everything running <span className="text-green-100 text-2xl font-bold">Smoothly</span></p>
      </div>
      
    </div>
  );
}
