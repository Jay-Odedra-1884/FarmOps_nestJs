"use client";

import React, { useEffect, useState } from "react";
import { MyHook } from "@/context/AppProvider";
import { getFarms } from "@/services/FarmApi";
import { getCrop } from "@/services/cropApi";
import {
  getExpenseCategories,
  addExpense,
  addExpenseCategory,
} from "@/services/expenseApi";
import { Spinner } from "@/components/ui/spinner";
import { PlusIcon, XIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";

function AddTransactionForm() {
  const {
    authToken,
    notifyExpenseChange,
    farmVersion,
    categoryVersion,
    notifyCategoryChange,
  } = MyHook();

  // ─── Dropdown Data ────────────────────────────────────────────────────────
  const [farms, setFarms] = useState([]);
  const [crops, setCrops] = useState([]);
  const [categories, setCategories] = useState([]);

  // ─── Loading States ───────────────────────────────────────────────────────
  const [farmsLoading, setFarmsLoading] = useState(true);
  const [cropsLoading, setCropsLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ─── New Category Inline UI State ─────────────────────────────────────────
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [savingCategory, setSavingCategory] = useState(false);

  // ─── Form Field State ─────────────────────────────────────────────────────
  const [selectedFarmId, setSelectedFarmId] = useState("");
  const [selectedCropId, setSelectedCropId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(new Date());

  // ─── Fetch Farms (watches farmVersion) ───────────────────────────────────
  // Re-runs only when farms change (add farm, delete farm, add/delete crop).
  useEffect(() => {
    if (!authToken) return;
    setFarmsLoading(true);
    getFarms(authToken)
      .then((res) => {
        if (res?.success) setFarms(res.data);
      })
      .finally(() => setFarmsLoading(false));
  }, [authToken, farmVersion]);

  // ─── Fetch Categories (watches categoryVersion) ───────────────────────────
  // Re-runs only when a user adds or deletes a custom category.
  useEffect(() => {
    if (!authToken) return;
    setCategoriesLoading(true);
    getExpenseCategories(authToken)
      .then((res) => {
        if (res?.success) setCategories(res.data);
      })
      .finally(() => setCategoriesLoading(false));
  }, [authToken, categoryVersion]);

  // ─── Fetch Crops When Farm Changes ───────────────────────────────────────
  // Every time the user picks a different farm, we re-fetch crops for that farm.
  // This makes the Crop dropdown dynamic — it only shows crops that belong to the selected farm.
  useEffect(() => {
    // If no farm is selected, clear the crops list and reset the crop selection
    if (!selectedFarmId) {
      setCrops([]);
      setSelectedCropId("");
      return;
    }

    setCropsLoading(true);
    setSelectedCropId(""); // Reset previously selected crop when farm changes
    getCrop(authToken, selectedFarmId)
      .then((res) => {
        if (res?.success) setCrops(res.data);
      })
      .finally(() => setCropsLoading(false));
  }, [selectedFarmId, authToken]); // Re-runs whenever selectedFarmId changes

  // ─── Form Validation ──────────────────────────────────────────────────────
  // Checks all required fields before submitting.
  // Returns true if the form is valid, false otherwise.
  // Also sets the `errors` state so red messages appear under each invalid field.
  const validate = () => {
    const newErrors = {};

    if (!amount || isNaN(amount) || Number(amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!selectedFarmId) newErrors.farm_id = "Select a farm";
    if (!selectedCropId) newErrors.crop_id = "Select a crop";
    if (!selectedCategoryId) newErrors.category_id = "Select a category";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Valid if no errors
  };

  // ─── Add Custom Category Handler ─────────────────────────────────────────
  const handleAddCategory = async (e) => {
    e?.preventDefault();
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;
    setSavingCategory(true);
    const res = await addExpenseCategory(authToken, trimmed);
    if (res?.success) {
      setNewCategoryName("");
      setShowCategoryInput(false);
      setSelectedCategoryId(String(res.data.id)); // auto-select the new category
      notifyCategoryChange(); // only category dropdown re-fetches
    }
    setSavingCategory(false);
  };

  // ─── Form Submit Handler ──────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    const res = await addExpense(authToken, {
      amount: parseFloat(amount),
      note: note.trim() || null,
      type,
      farm_id: parseInt(selectedFarmId),
      crop_id: parseInt(selectedCropId),
      category_id: parseInt(selectedCategoryId),
      expense_date: date.toLocaleDateString("en-CA"), // "YYYY-MM-DD" in local timezone
    });
    if (res?.success) {
      setAmount("");
      setNote("");
      setType("expense");
      setSelectedFarmId("");
      setSelectedCropId("");
      setSelectedCategoryId("");
      setErrors({});
      notifyExpenseChange(); // only expense lists & stats re-fetch
    }
    setSubmitting(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="bg-white h-full rounded-tr-none rounded-2xl p-5 flex flex-col">
      {/* Form title */}
      <h2 className="text-lg font-semibold text-gray-800 mb-5 flex items-center gap-2">
        Add Transaction
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-1 ">
        {/* ── Type Toggle (Expense / Income) ──
                    Two buttons that act as a toggle. Clicking one sets the `type` state.
                    The active button is highlighted in color (red for expense, green for income).
                    The submit button color also changes to match the selected type. */}
        <div className="flex rounded-lg overflow-hidden border">
          <button
            type="button"
            onClick={() => setType("expense")}
            className={`flex-1 py-2 text-sm font-medium transition-all ${
              type === "expense"
                ? "bg-red-500 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType("income")}
            className={`flex-1 py-2 text-sm font-medium transition-all ${
              type === "income"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            Income
          </button>
        </div>

        {/* ── Amount ──
                    Required field. Validated to be a positive number. */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Amount *
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${
              type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200"
            }`}
          />
          {/* Show error message if validation failed for this field */}
          {errors.amount && (
            <p className="text-red-500 text-xs mt-0.5">{errors.amount}</p>
          )}
        </div>

        {/* ── Note (Optional) ──
                    Free-text field for a short description of the transaction.
                    Sent as null to the backend if left empty. */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Note (optional)
          </label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Fertilizer purchase"
            className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none
                ${type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200"}
                `}
          />
        </div>

        {/* ── Category Dropdown + Add Popup ── */}
        <div className="relative">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-600">
              Category *
            </label>

            {/* "+ New" button — toggles the popup */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowCategoryInput((v) => !v);
                  setNewCategoryName("");
                }}
                className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium transition cursor-pointer"
              >
                <PlusIcon className="size-3" />
                {showCategoryInput ? "Cancel" : "Add New Category"}
              </button>

              {/* Popup card */}
              {showCategoryInput && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-gray-800">
                      New Category
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowCategoryInput(false);
                        setNewCategoryName("");
                      }}
                      className="text-gray-400 hover:text-gray-600 transition"
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>
                  <div className="flex flex-col gap-3">
                    <input
                      autoFocus
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddCategory(e);
                      }}
                      placeholder="e.g. Pesticides"
                      maxLength={50}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      disabled={savingCategory || !newCategoryName.trim()}
                      className="w-full bg-green-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {savingCategory ? "Saving..." : "Add Category"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {categoriesLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-1">
              <Spinner className="size-4" /> Loading...
            </div>
          ) : (
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none
                ${type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200"}
                `}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.user_id ? `${cat.name}` : cat.name}
                </option>
              ))}
            </select>
          )}
          {errors.category_id && (
            <p className="text-red-500 text-xs mt-0.5">{errors.category_id}</p>
          )}
        </div>

        {/* ── Farm Dropdown ──
                    Fetched from GET /farms on mount.
                    Selecting a farm triggers the Crop dropdown to reload with that farm's crops. */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Farm *
          </label>
          {farmsLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-1">
              <Spinner className="size-4" /> Loading...
            </div>
          ) : (
            <select
              value={selectedFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)} // Triggers crop useEffect
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none
                ${type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200"}
                `}
            >
              <option value="">Select farm</option>
              {farms.map((farm) => (
                <option key={farm.id} value={farm.id}>
                  {farm.name}
                </option>
              ))}
            </select>
          )}
          {errors.farm_id && (
            <p className="text-red-500 text-xs mt-0.5">{errors.farm_id}</p>
          )}
        </div>

        {/* ── Crop Dropdown (Dynamic) ──
                    This is DEPENDENT on the Farm selection above.
                    - Before a farm is selected: disabled, shows "Select a farm first"
                    - After a farm is selected: fetches GET /crops?farm_id={id} and shows results
                    - If the farm changes: crops reset and re-fetch automatically */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Crop *
          </label>
          {cropsLoading ? (
            <div className="flex items-center gap-2 text-gray-400 text-sm py-1">
              <Spinner className="size-4" /> Loading crops...
            </div>
          ) : (
            <select
              value={selectedCropId}
              onChange={(e) => setSelectedCropId(e.target.value)}
              disabled={!selectedFarmId} // Disabled until a farm is picked
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none
                ${type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200"}
                `}
            >
              <option value="">
                {selectedFarmId ? "Select crop" : "Select a farm first"}
              </option>
              {crops.map((crop) => (
                <option key={crop.id} value={crop.id}>
                  {crop.name}
                </option>
              ))}
            </select>
          )}
          {errors.crop_id && (
            <p className="text-red-500 text-xs mt-0.5">{errors.crop_id}</p>
          )}
        </div>
        {/* Date */}
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Date
        </label>
        {/* <div className="border px-4 py-2 rounded-lg">{date.toDateString()}</div> */}
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(date) => date > new Date()}
            className="rounded-lg border w-full"
            captionLayout="dropdown"
          />
        </div>
        {/* ── Submit Button ──
                    - Color changes based on type: red for Expense, green for Income
                    - Shows "Saving..." while the API call is in progress
                    - Disabled while submitting to prevent duplicate submissions */}
        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all duration-200 mt-1 ${
            type === "income"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-500 hover:bg-red-600"
          } disabled:opacity-60`}
        >
          {submitting
            ? "Saving..."
            : `Add ${type === "income" ? "Income" : "Expense"}`}
        </button>
      </form>
    </div>
  );
}

export default AddTransactionForm;
