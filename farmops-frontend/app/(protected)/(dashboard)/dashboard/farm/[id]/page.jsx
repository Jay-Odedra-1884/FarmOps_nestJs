"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MyHook } from "@/context/AppProvider";
import { getFarmById, updateFarm, deleteFarm } from "@/services/FarmApi";
import { Spinner } from "@/components/ui/spinner";
import ExpenseList from "@/components/dashboard/ExpenseList";
import {
  MapPinIcon,
  SquaresSubtractIcon,
  ArrowLeftIcon,
  Trash2Icon,
  Edit2Icon,
} from "lucide-react";
import Link from "next/link";
import { getFarmStats } from "@/services/statsApi";
import CropList from "@/components/dashboard/CropList";

function FarmDetailPage() {
  const { id: farmId } = useParams();
  const router = useRouter();
  const { authToken, expenseVersion, notifyExpenseChange, notifyFarmChange } =
    MyHook();

  // Farm state
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const editFormRef = useRef(null);
  const [farmErrors, setFarmErrors] = useState({});

  //stats state
  const [stats, setStats] = useState({});
  const [statsLoading, setStatsLoading] = useState(false);

  // Farm data — only loads once (on mount / farmId change), not on expense add
  useEffect(() => {
    if (authToken && farmId) {
      setLoading(true);
      getFarmById(authToken, farmId)
        .then((res) => {
          if (res.success) setFarm(res.data);
          else console.error(res.message);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [authToken, farmId]);

  // Stats — re-fetches whenever an expense is added/deleted (expenseVersion bump)
  useEffect(() => {
    if (authToken && farmId) {
      setStatsLoading(true);
      getFarmStats(authToken, farmId)
        .then((res) => {
          setStats(res.data);
        })
        .catch(console.error)
        .finally(() => setStatsLoading(false));
    }
  }, [authToken, farmId, expenseVersion]);

  // Farm handlers
  const validateFarmForm = (data) => {
    const newErrors = {};
    if (!data.get("farmName")) newErrors.farmName = "Farm name is required";
    setFarmErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleFarmEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(editFormRef.current);
    if (validateFarmForm(formData)) {
      const updateData = {
        name: formData.get("farmName"),
        location: formData.get("farmLocation") || null,
        size: formData.get("farmSize") || null,
      };
      const response = await updateFarm(authToken, farmId, updateData);
      if (response.success) {
        setFarm(response.data || { ...farm, ...updateData });
        setIsEditFormOpen(false);
        notifyFarmChange();
        setFarmErrors({});
      }
    }
  };

  const handleDeleteFarm = async () => {
    setIsDeleting(true);
    try {
      const response = await deleteFarm(authToken, farmId);
      if (response.success) {
        notifyExpenseChange(); // cascade-deleted expenses → reload lists & stats
        notifyFarmChange(); // farm removed → update farm dropdowns
        router.push("/dashboard");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  // ── Render ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full h-full flex justify-center items-center py-20">
        <Spinner className="size-10" />
      </div>
    );
  }

  if (!farm) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center py-20">
        <p className="text-gray-500 mb-4">
          Farm not found or you don't have access.
        </p>
        <Link
          href="/dashboard"
          className="text-green-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeftIcon className="size-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 space-y-6">
      {/* Nav Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 transition mb-2"
      >
        <ArrowLeftIcon className="size-4" /> Back to Dashboard
      </Link>

      {/* Farm Header Card*/}
      <div className="w-full bg-white shadow rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Farm info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{farm.name}</h1>
            <div className="flex flex-wrap gap-4 mt-2 text-gray-500 text-sm">
              {farm.location && (
                <p className="flex gap-1.5 items-center">
                  <MapPinIcon className="size-4 text-gray-400" />
                  {farm.location}
                </p>
              )}
              {farm.size && (
                <p className="flex gap-1.5 items-center">
                  <SquaresSubtractIcon className="size-4 text-gray-400" />
                  {farm.size} Acres
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 relative">
            {/* Edit Button */}
            <div className="relative w-1/2 md:w-auto">
              <button
                onClick={() => setIsEditFormOpen(!isEditFormOpen)}
                className="w-full bg-green-600 text-white hover:bg-green-700 hover:scale-105 border border-green-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit2Icon className="size-4" /> Edit
              </button>

              {isEditFormOpen && (
                <div className="absolute right-0 top-full mt-3 w-[18rem] md:w-80 bg-white rounded-xl shadow-xl border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-800">Edit Farm</h3>
                    <button
                      onClick={() => setIsEditFormOpen(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                  <form
                    ref={editFormRef}
                    onSubmit={handleFarmEditSubmit}
                    className="flex flex-col space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Farm Name
                      </label>
                      <input
                        type="text"
                        name="farmName"
                        defaultValue={farm.name}
                        placeholder="Farm name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                      {farmErrors.farmName && (
                        <p className="text-red-500 text-xs mt-1">
                          {farmErrors.farmName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Location (optional)
                      </label>
                      <input
                        type="text"
                        name="farmLocation"
                        defaultValue={farm.location || ""}
                        placeholder="Farm location"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Farm Size (optional)
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="farmSize"
                        defaultValue={farm.size || ""}
                        placeholder="Farm Size"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-green-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition"
                    >
                      Save Changes
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Delete Button */}
            <div className="w-1/2 md:w-auto relative">
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="w-full bg-red-600 text-white hover:bg-red-700 hover:scale-105 border border-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2Icon className="size-4" /> Delete
              </button>

              {deleteModalOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <p className="text-sm text-gray-800 mb-4">
                    Are you sure you want to delete this farm? This action
                    cannot be undone.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setDeleteModalOpen(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded-lg text-sm hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteFarm}
                      disabled={isDeleting}
                      className="flex-1 bg-red-600 text-white py-1.5 rounded-lg text-sm hover:bg-red-700 transition disabled:bg-red-400"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="w-full h-24 text-black bg-white shadow rounded-2xl flex flex-col justify-center items-center">
          <p className="text-sm font-medium text-gray-500">Expenses</p>
          <p className="text-red-500 text-2xl font-bold mt-1">
            {statsLoading ? (
              <Spinner className="size-8" />
            ) : (
              "₹" + stats.expenses
            )}
          </p>
        </div>
        <div className="w-full h-24 text-black bg-white shadow rounded-2xl flex flex-col justify-center items-center">
          <p className="text-sm font-medium text-gray-500">Income</p>
          <p className="text-green-500 text-2xl font-bold mt-1">
            {statsLoading ? <Spinner className="size-8" /> : "₹" + stats.income}
          </p>
        </div>
        <div className="w-full h-24 text-black bg-white shadow rounded-2xl flex flex-col justify-center items-center">
          <p className="text-sm font-medium text-gray-500">Profit</p>
          <p
            className={`text-2xl font-bold mt-1 ${stats.profit < 0 ? "text-red-500" : "text-green-500"}`}
          >
            {statsLoading ? (
              <Spinner className="size-8 text-blue-500" />
            ) : (
              "₹" + stats.profit
            )}
          </p>
        </div>
      </div>

      {/* Crops Section */}
      <CropList farmId={farmId} />

      {/* Expense List for this Farm */}
      <ExpenseList farmId={farmId} showFarm={false} title="Farm Transactions" />
    </div>
  );
}

export default FarmDetailPage;
