"use client";

import { Spinner } from "@/components/ui/spinner";
import {
  TrendingDownIcon,
  TrendingUpIcon,
  SproutIcon,
  MapPinIcon,
  TagIcon,
  Edit2Icon,
  Trash2Icon,
} from "lucide-react";

/**
 * A single row in the desktop expense table.
 *
 * Props:
 *  expense          – expense object
 *  showFarm         – boolean, whether to show farm column
 *  fmt              – currency formatter fn (n) => string
 *  fmtDate          – date formatter fn (str) => string
 *  isEditing        – boolean, true when this row's edit modal is open
 *  confirmDeleteId  – ID currently pending delete confirmation
 *  deletingExpenseId – ID currently being deleted (spinner shown)
 *  onEdit           – () => void, opens edit modal for this expense
 *  onDeleteConfirm  – () => void, opens delete confirmation for this expense
 *  onDeleteCancel   – () => void, dismisses delete confirmation
 *  onDeleteConfirmed – () => void, executes the delete
 */
export default function ExpenseTableRow({
  expense,
  showFarm,
  fmt,
  fmtDate,
  isEditing,
  confirmDeleteId,
  deletingExpenseId,
  onEdit,
  onDeleteConfirm,
  onDeleteCancel,
  onDeleteConfirmed,
}) {
  const isConfirmingDelete = confirmDeleteId === expense.id;
  const isDeleting = deletingExpenseId === expense.id;

  return (
    <tr className="hover:bg-gray-50 transition-colors duration-100">
      {/* ── Type badge ── */}
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            expense.type === "income"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}
        >
          {expense.type === "income" ? (
            <TrendingUpIcon className="size-3" />
          ) : (
            <TrendingDownIcon className="size-3" />
          )}
          {expense.type === "income" ? "Income" : "Expense"}
        </span>
      </td>

      {/* ── Farm / Crop ── */}
      {showFarm ? (
        <td className="px-4 py-3">
          <div className="flex flex-col gap-0.5">
            {expense.farm?.name && (
              <span className="flex items-center gap-1 text-gray-700 font-medium">
                <MapPinIcon className="size-3 text-gray-400 shrink-0" />
                {expense.farm.name}
              </span>
            )}
            {expense.crop?.name && (
              <span className="flex items-center gap-1 text-gray-400 text-xs">
                <SproutIcon className="size-3 text-green-400 shrink-0" />
                {expense.crop.name}
              </span>
            )}
          </div>
        </td>
      ) : (
        <td className="px-4 py-3">
          {expense.crop?.name && (
            <span className="flex items-center gap-1 text-gray-400 text-xs">
              <SproutIcon className="size-3 text-green-400 shrink-0" />
              {expense.crop.name}
            </span>
          )}
        </td>
      )}

      {/* ── Category ── */}
      <td className="px-4 py-3">
        {expense.category?.name ? (
          <span className="flex items-center gap-1 text-gray-600">
            <TagIcon className="size-3 text-gray-400" />
            {expense.category.name}
          </span>
        ) : (
          <span className="text-gray-300">—</span>
        )}
      </td>

      {/* ── Note ── */}
      <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">
        {expense.note || <span className="text-gray-300">—</span>}
      </td>

      {/* ── Amount ── */}
      <td className="px-4 py-3 text-right font-semibold">
        <span
          className={
            expense.type === "income" ? "text-green-600" : "text-red-500"
          }
        >
          {expense.type === "income" ? "+" : "-"}
          {fmt(expense.amount)}
        </span>
      </td>

      {/* ── Date ── */}
      <td className="px-4 py-3 text-right text-gray-400 whitespace-nowrap">
        {fmtDate(expense.expense_date)}
      </td>

      {/* ── Actions ── */}
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-2">
          {/* Edit button */}
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 border border-green-200 transition"
            title="Edit transaction"
          >
            <Edit2Icon className="size-3.5" />
          </button>

          {/* Delete button + inline confirmation popup */}
          <div className="relative">
            <button
              onClick={isConfirmingDelete ? onDeleteCancel : onDeleteConfirm}
              disabled={isDeleting}
              className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 border border-red-200 transition disabled:opacity-40"
              title="Delete transaction"
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
      </td>
    </tr>
  );
}
