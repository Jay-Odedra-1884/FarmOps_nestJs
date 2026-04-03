"use client";

import {
  CheckIcon,
  Edit2Icon,
  PlusIcon,
  SproutIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import { addCrop, deleteCrop, getCrop, updateCrop } from "@/services/cropApi";
import { MyHook } from "@/context/AppProvider";

function CropList({ farmId, onDataChange }) {
  const { authToken, notifyExpenseChange, notifyFarmChange } = MyHook();
  const [crops, setCrops] = useState([]);
  const [cropsLoading, setCropsLoading] = useState(true);
  const [addCropName, setAddCropName] = useState("");
  const [isAddingCrop, setIsAddingCrop] = useState(false);
  const [editingCropId, setEditingCropId] = useState(null);
  const [editingCropName, setEditingCropName] = useState("");
  const [deletingCropId, setDeletingCropId] = useState(null);
  const [confirmDeleteCropId, setConfirmDeleteCropId] = useState(null);
  const [cropErrors, setCropErrors] = useState({});

  useEffect(() => {
    setCropsLoading(true);
    getCrop(authToken, farmId)
      .then((res) => {
        if (res.success) setCrops(res.data);
      })
      .catch(console.error)
      .finally(() => setCropsLoading(false));
  }, [authToken, farmId]);

  // Crop handlers
  const validateCropForm = () => {
    const newErrors = {};
    if (!addCropName.trim()) newErrors.cropName = "Crop name is required";
    setCropErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCrop = async (e) => {
    e.preventDefault();
    if (validateCropForm()) {
      setIsAddingCrop(true);
      const res = await addCrop(authToken, {
        name: addCropName.trim(),
        farm_id: farmId,
      });
      if (res?.success) {
        setCrops((prev) => [res.data, ...prev]);
        setAddCropName("");
        notifyFarmChange(); // new crop → AddTransactionForm crop dropdown re-fetches
      }
    }
    setIsAddingCrop(false);
  };

  const handleStartEditCrop = (crop) => {
    setEditingCropId(crop.id);
    setEditingCropName(crop.name);
  };

  const handleCancelEditCrop = () => {
    setEditingCropId(null);
    setEditingCropName("");
  };

  const handleSaveEditCrop = async (cropId) => {
    if (!editingCropName.trim()) return;
    const res = await updateCrop(
      authToken,
      { name: editingCropName.trim() },
      cropId,
    );
    if (res?.success) {
      setCrops((prev) =>
        prev.map((c) =>
          c.id === cropId ? { ...c, name: editingCropName.trim() } : c,
        ),
      );
    }
    setEditingCropId(null);
    setEditingCropName("");
  };

  const handleDeleteCrop = async (cropId) => {
    setDeletingCropId(cropId);
    setConfirmDeleteCropId(null);
    const res = await deleteCrop(authToken, cropId);
    if (res?.success) {
      setCrops((prev) => prev.filter((c) => c.id !== cropId));
      notifyExpenseChange(); // cascade deletes expenses → reload ExpenseList & stats
      notifyFarmChange(); // crop removed → AddTransactionForm crop dropdown re-fetches
    }
    setDeletingCropId(null);
  };

  return (
    <div>
      <div className="w-full bg-white shadow rounded-2xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <SproutIcon className="size-5 text-green-600" /> Crops
          </h2>

          {/* Add crop inline form */}
          <form onSubmit={handleAddCrop} className="flex items-center gap-0">
            <input
              type="text"
              value={addCropName}
              onChange={(e) => setAddCropName(e.target.value)}
              placeholder={
                cropErrors.cropName ? cropErrors.cropName : "New crop name..."
              }
              className={`border border-gray-300 border-r-0 rounded-l-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${cropErrors.cropName ? "border-red-500 text-red-500" : ""}`}
            />

            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1.5 border border-green-600 rounded-r-lg text-sm font-medium hover:bg-green-700 transition cursor-pointer flex items-center gap-1"
            >
              <PlusIcon className="size-4" />
              {isAddingCrop ? "Adding..." : "Add"}
            </button>
          </form>
        </div>

        <hr className="border-gray-100 mb-4" />
        {cropsLoading ? (
          <div className="flex justify-center py-10">
            <Spinner className="size-8" />
          </div>
        ) : crops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <SproutIcon className="size-10 mb-3 text-gray-300" />
            <p className="text-sm">
              No crops added yet. Add your first crop above.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {crops.map((crop) => (
              <div
                key={crop.id}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-150 hover:bg-gray-100"
              >
                {/* Crop name / edit input */}
                {editingCropId === crop.id ? (
                  <input
                    autoFocus
                    type="text"
                    value={editingCropName}
                    onChange={(e) => setEditingCropName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEditCrop(crop.id);
                      if (e.key === "Escape") handleCancelEditCrop();
                    }}
                    className="flex-1 bg-white border border-green-400 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 mr-3"
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <SproutIcon className="size-4 text-green-500" />
                    <span className="font-medium text-gray-800">
                      {crop.name}
                    </span>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {editingCropId === crop.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEditCrop(crop.id)}
                        className="p-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 transition"
                        title="Save"
                      >
                        <CheckIcon className="size-4" />
                      </button>
                      <button
                        onClick={handleCancelEditCrop}
                        className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition"
                        title="Cancel"
                      >
                        <XIcon className="size-4" />
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2 bg-white px-2 py-1 rounded-lg border">
                      <button
                        onClick={() => {
                          setConfirmDeleteCropId(null);
                          handleStartEditCrop(crop);
                        }}
                        className="p-1.5 rounded-lg text-green-700 hover:bg-green-100 transition"
                        title="Edit crop"
                      >
                        <Edit2Icon className="size-3.5" />
                      </button>

                      {/* Delete btn + inline confirmation popup */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            confirmDeleteCropId === crop.id
                              ? setConfirmDeleteCropId(null)
                              : setConfirmDeleteCropId(crop.id)
                          }
                          disabled={deletingCropId === crop.id}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 transition disabled:opacity-40"
                          title="Delete crop"
                        >
                          {deletingCropId === crop.id ? (
                            <Spinner className="size-3.5" />
                          ) : (
                            <Trash2Icon className="size-3.5" />
                          )}
                        </button>

                        {confirmDeleteCropId === crop.id && (
                          <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                            <p className="text-sm  mb-3">
                              Are you sure you want to delete &ldquo;{crop.name}&rdquo;? 
                              All related expenses will also be deleted
                              And this action cannot be undone.
                            </p>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setConfirmDeleteCropId(null)}
                                className="flex-1 bg-gray-100 text-gray-700 py-1.5 rounded-lg text-xs hover:bg-gray-200 transition"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDeleteCrop(crop.id)}
                                disabled={deletingCropId === crop.id}
                                className="flex-1 bg-red-600 text-white py-1.5 rounded-lg text-xs hover:bg-red-700 transition disabled:bg-red-400"
                              >
                                {deletingCropId === crop.id
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CropList;
