"use client";

import { Spinner } from "@/components/ui/spinner";
import { XIcon } from "lucide-react";

/**
 * Full-screen fixed modal for editing an expense/income transaction.
 * Rendered at the top level of ExpenseList so it never affects page layout.
 *
 * Props:
 *  editForm        – current form values
 *  setEditForm     – state setter for form values
 *  editErrors      – validation error messages { amount?, category_id? }
 *  submittingEdit  – boolean, true while saving
 *  categories      – array of category objects { id, name }
 *  farms           – array of farm objects { id, name }
 *  farmsLoading    – boolean
 *  crops           – array of crop objects { id, name }
 *  cropsLoading    – boolean
 *  onSave          – called when Save Changes is clicked
 *  onClose         – called when backdrop or X is clicked
 */
export default function ExpenseEditModal({
  editForm,
  setEditForm,
  editErrors,
  submittingEdit,
  categories,
  farms,
  farmsLoading,
  crops,
  cropsLoading,
  onSave,
  onClose,
}) {
  const ringClass =
    editForm.type === "expense" ? "focus:ring-red-200" : "focus:ring-green-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

      {/* Modal panel – stop clicks propagating to backdrop */}
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="font-semibold text-gray-800">Edit Transaction</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <XIcon className="size-5" />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {/* ── Type toggle ── */}
          <div className="flex rounded-lg overflow-hidden border">
            {["expense", "income"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setEditForm((f) => ({ ...f, type: t }))}
                className={`flex-1 py-2 text-sm font-medium transition-all capitalize ${
                  editForm.type === t
                    ? t === "expense"
                      ? "bg-red-500 text-white"
                      : "bg-green-600 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* ── Amount ── */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Amount *
            </label>
            <input
              type="number"
              value={editForm.amount}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, amount: e.target.value }))
              }
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${ringClass}`}
            />
            {editErrors.amount && (
              <p className="text-red-500 text-xs mt-0.5">{editErrors.amount}</p>
            )}
          </div>

          {/* ── Note ── */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Note (optional)
            </label>
            <input
              type="text"
              value={editForm.note}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, note: e.target.value }))
              }
              placeholder="e.g. Fertilizer purchase"
              className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${ringClass}`}
            />
          </div>

          {/* ── Category ── */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Category *
            </label>
            <select
              value={editForm.category_id}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, category_id: e.target.value }))
              }
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${ringClass}`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {editErrors.category_id && (
              <p className="text-red-500 text-xs mt-0.5">
                {editErrors.category_id}
              </p>
            )}
          </div>

          {/* ── Farm ── */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Farm
            </label>
            {farmsLoading ? (
              <div className="flex items-center gap-2 text-gray-400 text-xs py-1">
                <Spinner className="size-3" /> Loading farms...
              </div>
            ) : (
              <select
                value={editForm.farm_id}
                onChange={(e) =>
                  setEditForm((f) => ({
                    ...f,
                    farm_id: e.target.value,
                    crop_id: "", // reset crop when farm changes
                  }))
                }
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${ringClass}`}
              >
                <option value="">Select farm</option>
                {farms.map((farm) => (
                  <option key={farm.id} value={farm.id}>
                    {farm.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* ── Crop ── */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Crop
            </label>
            {cropsLoading ? (
              <div className="flex items-center gap-2 text-gray-400 text-xs py-1">
                <Spinner className="size-3" /> Loading crops...
              </div>
            ) : (
              <select
                value={editForm.crop_id}
                disabled={!editForm.farm_id}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, crop_id: e.target.value }))
                }
                className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${ringClass}`}
              >
                <option value="">
                  {editForm.farm_id ? "Select crop" : "Select a farm first"}
                </option>
                {crops.map((crop) => (
                  <option key={crop.id} value={crop.id}>
                    {crop.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* ── Date ── */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Date
            </label>
            <input
              type="date"
              value={editForm.expense_date || ""}
              onChange={(e) =>
                setEditForm((f) => ({ ...f, expense_date: e.target.value }))
              }
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:outline-none ${ringClass}`}
            />
          </div>

          {/* ── Save button ── */}
          <button
            onClick={onSave}
            disabled={submittingEdit}
            className={`w-full py-2.5 rounded-lg text-sm font-medium text-white transition-all disabled:opacity-60 mt-1 ${
              editForm.type === "income"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {submittingEdit ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner className="size-4" /> Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
