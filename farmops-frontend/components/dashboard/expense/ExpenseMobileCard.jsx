"use client";

import { Spinner } from "@/components/ui/spinner";
import {
  SproutIcon,
  MapPinIcon,
  TagIcon,
  Edit2Icon,
  Trash2Icon,
} from "lucide-react";

/**
 * Mobile card for a single expense/income transaction.
 *
 * Props:
 *  expense           – expense object
 *  showFarm          – boolean, whether to show farm info
 *  fmt               – currency formatter fn (n) => string
 *  fmtDate           – date formatter fn (str) => string
 *  confirmDeleteId   – ID currently pending delete confirmation
 *  deletingExpenseId – ID currently being deleted (spinner shown)
 *  onEdit            – () => void, opens edit modal for this expense
 *  onDeleteConfirm   – () => void, opens delete confirmation for this expense
 *  onDeleteCancel    – () => void, dismisses delete confirmation
 *  onDeleteConfirmed – () => void, executes the delete
 */
export default function ExpenseMobileCard({
  expense,
  showFarm,
  fmt,
  fmtDate,
  confirmDeleteId,
  deletingExpenseId,
  onEdit,
  onDeleteConfirm,
  onDeleteCancel,
  onDeleteConfirmed,
}) {
  const isConfirmingDelete = confirmDeleteId === expense.id;
  const isDeleting = deletingExpenseId === expense.id;
  const isIncome = expense.type === "income";

  return (
    <div
      className={`rounded-xl border px-4 py-3 flex flex-col gap-2 ${
        isIncome
          ? "border-green-100 bg-green-50/40"
          : "border-red-100 bg-red-50/40"
      }`}
    >
      {/* ── Top row: badge + category + amount + action buttons ── */}
      <div className="flex items-start justify-between gap-2">
        {/* Left: type badge + category */}
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              isIncome
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {isIncome ? "Income" : "Expense"}
          </span>
          {expense.category?.name && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <TagIcon className="size-3" />
              {expense.category.name}
            </span>
          )}
        </div>

        {/* Right: amount + action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`font-bold text-base ${
              isIncome ? "text-green-600" : "text-red-500"
            }`}
          >
            {isIncome ? "+" : "-"}
            {fmt(expense.amount)}
          </span>

          {/* Edit */}
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 border border-green-200 transition"
            title="Edit"
          >
            <Edit2Icon className="size-3.5" />
          </button>

          {/* Delete + inline confirmation */}
          <div className="relative">
            <button
              onClick={isConfirmingDelete ? onDeleteCancel : onDeleteConfirm}
              disabled={isDeleting}
              className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 border border-red-200 transition disabled:opacity-40"
              title="Delete"
            >
              {isDeleting ? (
                <Spinner className="size-3.5" />
              ) : (
                <Trash2Icon className="size-3.5" />
              )}
            </button>

            {isConfirmingDelete && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <p className="text-sm text-gray-800 mb-3">
                  Delete this transaction? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={onDeleteCancel}
                    className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded-lg text-xs hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onDeleteConfirmed}
                    disabled={isDeleting}
                    className="flex-1 bg-red-600 text-white py-1.5 rounded-lg text-xs hover:bg-red-700 transition disabled:bg-red-400"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Farm / Crop info ── */}
      {showFarm && expense.farm?.name && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <MapPinIcon className="size-3" />
          {expense.farm.name}
          {expense.crop?.name && (
            <span className="flex items-center gap-1">
              <SproutIcon className="size-3 text-green-400" />
              {expense.crop.name}
            </span>
          )}
        </p>
      )}
      {!showFarm && expense.crop?.name && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <SproutIcon className="size-3 text-green-400" />
          {expense.crop.name}
        </p>
      )}

      {/* ── Note ── */}
      {expense.note && (
        <p className="text-xs text-gray-400 truncate">{expense.note}</p>
      )}

      {/* ── Date ── */}
      <p className="text-xs text-gray-300">{fmtDate(expense.expense_date)}</p>
    </div>
  );
}
