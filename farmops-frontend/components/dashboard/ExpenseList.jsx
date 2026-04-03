"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import {
  TrendingDownIcon,
  TrendingUpIcon,
  ReceiptIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XIcon,
  CalendarIcon,
  TagIcon,
} from "lucide-react";
import { MyHook } from "@/context/AppProvider";
import {
  getAllExpenses,
  getExpensesByFarm,
  getExpenseCategories,
  updateExpense,
  deleteExpense,
} from "@/services/expenseApi";
import { getCrop } from "@/services/cropApi";
import { getFarms } from "@/services/FarmApi";

// Sub-components (split for readability)
import ExpenseEditModal from "./expense/ExpenseEditModal";
import ExpenseTableRow from "./expense/ExpenseTableRow";
import ExpenseMobileCard from "./expense/ExpenseMobileCard";

// ── Helpers ────────────────────────────────────────────────────────────────
const fmt = (n) =>
  "₹" +
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const fmtDate = (dateStr) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ── Main Component ─────────────────────────────────────────────────────────
function ExpenseList({
  farmId = null,
  showFarm = true,
  title = "Transactions",
  onDataChange,
}) {
  const { authToken, expenseVersion, notifyExpenseChange, categoryVersion } =
    MyHook();

  // ── List state ─────────────────────────────────────────────────────────
  const [filter, setFilter] = useState({
    type: "",
    category_id: "",
    expense_date: "",
  });
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // ── Edit state ─────────────────────────────────────────────────────────
  const [editingExpense, setEditingExpense] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editErrors, setEditErrors] = useState({});

  // ── Delete state ───────────────────────────────────────────────────────
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState(null);

  // ── Dropdown data (edit form) ──────────────────────────────────────────
  const [categories, setCategories] = useState([]);
  const [farms, setFarms] = useState([]);
  const [farmsLoading, setFarmsLoading] = useState(false);
  const [crops, setCrops] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(false);

  // ── Summary totals ─────────────────────────────────────────────────────
  const totals = useMemo(
    () =>
      expenses.reduce(
        (acc, e) => {
          if (e.type === "income") acc.income += Number(e.amount);
          else acc.expense += Number(e.amount);
          return acc;
        },
        { income: 0, expense: 0 },
      ),
    [expenses],
  );

  // ── Filter helper ──────────────────────────────────────────────────────
  const handleFilterChange = (key, val) => {
    setCurrentPage(1);
    setFilter((prev) => ({ ...prev, [key]: val }));
  };

  // ── Data fetching ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!authToken) return;
    const cleanFilter = Object.fromEntries(
      Object.entries(filter).filter(([, v]) => v !== ""),
    );
    setLoading(true);
    const fetcher = farmId
      ? getExpensesByFarm(authToken, farmId, currentPage, cleanFilter)
      : getAllExpenses(authToken, currentPage, cleanFilter);

    fetcher
      .then((res) => {
        setExpenses(res.data.data);
        setLastPage(res.data.last_page ?? 1);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [authToken, currentPage, filter, expenseVersion]);

  // Fetch categories for the edit form dropdown
  useEffect(() => {
    if (!authToken) return;
    getExpenseCategories(authToken).then((res) => {
      if (res?.success) setCategories(res.data);
    });
  }, [authToken, categoryVersion]);

  // Fetch all farms for the edit form dropdown
  useEffect(() => {
    if (!authToken) return;
    setFarmsLoading(true);
    getFarms(authToken)
      .then((res) => {
        if (res?.success) setFarms(res.data);
      })
      .finally(() => setFarmsLoading(false));
  }, [authToken]);

  // Reload crops whenever the selected farm changes inside the edit form
  useEffect(() => {
    if (!editingExpense || !authToken) return;
    if (!editForm.farm_id) {
      setCrops([]);
      return;
    }
    setCropsLoading(true);
    getCrop(authToken, editForm.farm_id)
      .then((res) => {
        if (res?.success) setCrops(res.data);
      })
      .finally(() => setCropsLoading(false));
  }, [editForm.farm_id, authToken, editingExpense]);

  // ── Edit handlers ──────────────────────────────────────────────────────
  const openEdit = (expense) => {
    setConfirmDeleteId(null);
    setEditingExpense(expense);
    setEditForm({
      type: expense.type,
      amount: expense.amount,
      note: expense.note || "",
      category_id: expense.category_id ? String(expense.category_id) : "",
      crop_id: expense.crop_id ? String(expense.crop_id) : "",
      farm_id: expense.farm_id ? String(expense.farm_id) : "",
      expense_date: expense.expense_date
        ? expense.expense_date.slice(0, 10)
        : new Date().toLocaleDateString("en-CA"),
    });
    setEditErrors({});
  };

  const closeEdit = () => {
    setEditingExpense(null);
    setEditForm({});
    setEditErrors({});
    setCrops([]);
  };

  const handleSaveEdit = async () => {
    // Validate
    const errs = {};
    if (
      !editForm.amount ||
      isNaN(editForm.amount) ||
      Number(editForm.amount) <= 0
    )
      errs.amount = "Enter a valid amount";
    if (!editForm.category_id) errs.category_id = "Select a category";
    setEditErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmittingEdit(true);
    const res = await updateExpense(authToken, editingExpense.id, {
      type: editForm.type,
      amount: parseFloat(editForm.amount),
      note: editForm.note?.trim() || null,
      category_id: parseInt(editForm.category_id),
      crop_id: editForm.crop_id ? parseInt(editForm.crop_id) : undefined,
      farm_id: editForm.farm_id ? parseInt(editForm.farm_id) : undefined,
      expense_date: editForm.expense_date || undefined,
    });

    if (res?.success) {
      // Optimistically update the row in local state
      setExpenses((prev) =>
        prev.map((e) =>
          e.id === editingExpense.id
            ? {
                ...e,
                type: editForm.type,
                amount: editForm.amount,
                note: editForm.note?.trim() || null,
                expense_date: editForm.expense_date,
                farm:
                  farms.find((f) => String(f.id) === editForm.farm_id) ||
                  e.farm,
                category:
                  categories.find(
                    (c) => String(c.id) === editForm.category_id,
                  ) || e.category,
                crop:
                  crops.find((c) => String(c.id) === editForm.crop_id) ||
                  e.crop,
              }
            : e,
        ),
      );
      notifyExpenseChange();
      closeEdit();
    }
    setSubmittingEdit(false);
  };

  // ── Delete handlers ────────────────────────────────────────────────────
  const openConfirmDelete = (id) => {
    setEditingExpense(null); // close any open edit modal
    setConfirmDeleteId(id);
  };

  const handleDelete = async (id) => {
    setDeletingExpenseId(id);
    const res = await deleteExpense(authToken, id);
    if (res?.success) {
      setExpenses((prev) => prev.filter((e) => e.id !== id));
      notifyExpenseChange();
    }
    setDeletingExpenseId(null);
    setConfirmDeleteId(null);
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="w-full bg-white shadow rounded-2xl p-5 md:p-6 flex flex-col gap-4">
      {/* ── Row 1: title + pagination + type tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Pagination */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="size-5" />
            </button>
            <span className="text-sm font-medium text-gray-700 px-1">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage >= lastPage}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer hover:text-green-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="size-5" />
            </button>
          </div>

          {/* Type filter tabs */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {[
              { label: "All", value: "" },
              { label: "Expense", value: "expense" },
              { label: "Income", value: "income" },
            ].map((tab) => (
              <button
                key={tab.value || "all"}
                onClick={() => handleFilterChange("type", tab.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                  filter.type === tab.value
                    ? tab.value === "expense"
                      ? "bg-red-500 text-white shadow-sm"
                      : tab.value === "income"
                        ? "bg-green-600 text-white shadow-sm"
                        : "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
      {/* ── Date filter + Category filter ── */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Date filter  */}
        <div
          className={`flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 transition-all ${
            filter.expense_date ? "ring-2 ring-green-400/50" : ""
          }`}
        >
          <CalendarIcon className="size-4 text-gray-400 shrink-0" />
          <input
            type="date"
            value={filter.expense_date}
            onChange={(e) => handleFilterChange("expense_date", e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-700 w-[130px] cursor-pointer"
          />
          {filter.expense_date && (
            <button
              onClick={() => handleFilterChange("expense_date", "")}
              className="text-gray-400 hover:text-red-500 transition"
              title="Clear date filter"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div
          className={`flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2 transition-all ${
            filter.category_id ? "ring-2 ring-green-400/50" : ""
          }`}
        >
          <TagIcon className="size-4 text-gray-400 shrink-0" />
          <select
            value={filter.category_id}
            onChange={(e) => handleFilterChange("category_id", e.target.value)}
            className="bg-transparent outline-none text-sm text-gray-700 cursor-pointer max-w-[160px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          {filter.category_id && (
            <button
              onClick={() => handleFilterChange("category_id", "")}
              className="text-gray-400 hover:text-red-500 transition"
              title="Clear category filter"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>
      </div>
        </div>
      </div>


      {/* ── Summary pills ── */}
      {!loading && expenses.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-3 py-1.5 text-sm font-semibold">
            <TrendingDownIcon className="size-4" />
            {fmt(totals.expense)}
          </div>
          <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-600 rounded-xl px-3 py-1.5 text-sm font-semibold">
            <TrendingUpIcon className="size-4" />
            {fmt(totals.income)}
          </div>
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-semibold border ${
              totals.income - totals.expense >= 0
                ? "bg-blue-50 border-blue-100 text-blue-600"
                : "bg-orange-50 border-orange-100 text-orange-600"
            }`}
          >
            Net: {fmt(totals.income - totals.expense)}
          </div>
        </div>
      )}

      {/* ── Content: loading / empty / expense list ── */}
      {loading ? (
        <div className="flex justify-center items-center py-14">
          <Spinner className="size-9" />
        </div>
      ) : expenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-gray-400">
          <ReceiptIcon className="size-10 mb-3 text-gray-300" />
          <p className="text-sm">
            {filter.type === ""
              ? "No transactions yet."
              : `No ${filter.type} transactions found.`}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden sm:block overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-left">
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">
                    {showFarm && "Farm / "}Crop
                  </th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Note</th>
                  <th className="px-4 py-3 font-medium text-right">Amount</th>
                  <th className="px-4 py-3 font-medium text-right">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {expenses.map((expense) => (
                  <ExpenseTableRow
                    key={expense.id}
                    expense={expense}
                    showFarm={showFarm}
                    fmt={fmt}
                    fmtDate={fmtDate}
                    isEditing={editingExpense?.id === expense.id}
                    confirmDeleteId={confirmDeleteId}
                    deletingExpenseId={deletingExpenseId}
                    onEdit={() =>
                      editingExpense?.id === expense.id
                        ? closeEdit()
                        : openEdit(expense)
                    }
                    onDeleteConfirm={() => openConfirmDelete(expense.id)}
                    onDeleteCancel={() => setConfirmDeleteId(null)}
                    onDeleteConfirmed={() => handleDelete(expense.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex sm:hidden flex-col gap-2">
            {expenses.map((expense) => (
              <ExpenseMobileCard
                key={expense.id}
                expense={expense}
                showFarm={showFarm}
                fmt={fmt}
                fmtDate={fmtDate}
                confirmDeleteId={confirmDeleteId}
                deletingExpenseId={deletingExpenseId}
                onEdit={() =>
                  editingExpense?.id === expense.id
                    ? closeEdit()
                    : openEdit(expense)
                }
                onDeleteConfirm={() => openConfirmDelete(expense.id)}
                onDeleteCancel={() => setConfirmDeleteId(null)}
                onDeleteConfirmed={() => handleDelete(expense.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* ── Edit modal (fixed overlay, zero layout impact) ── */}
      {editingExpense && (
        <ExpenseEditModal
          editForm={editForm}
          setEditForm={setEditForm}
          editErrors={editErrors}
          submittingEdit={submittingEdit}
          categories={categories}
          farms={farms}
          farmsLoading={farmsLoading}
          crops={crops}
          cropsLoading={cropsLoading}
          onSave={handleSaveEdit}
          onClose={closeEdit}
        />
      )}
    </div>
  );
}

export default ExpenseList;
