"use client";

import React, { useEffect, useState, useCallback } from "react";
import { MyHook } from "@/context/AppProvider";
import {
  getAdminUsers,
  getAdminUser,
  suspendAdminUser,
  deleteAdminUser,
} from "@/services/adminApi";
import { Spinner } from "@/components/ui/spinner";
import UserDetailModal from "./UserDetailModal";
import { Search, Eye, Ban, Trash2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "", label: "All Users" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

export default function UserTable() {
  const { authToken } = MyHook();

  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Modal
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Confirm delete
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(
    async (page = 1) => {
      if (!authToken) return;
      setLoading(true);
      try {
        const res = await getAdminUsers(authToken, {
          search: debouncedSearch,
          status: statusFilter,
        });
        if (res.success) {
          setUsers(res.data.data);
          setPagination(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [authToken, debouncedSearch, statusFilter],
  );

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleView = async (id) => {
    setShowModal(true);
    setSelectedUser(null);
    setModalLoading(true);
    try {
      const res = await getAdminUser(authToken, id);
      if (res.success) setSelectedUser(res.data);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSuspend = async (id) => {
    const res = await suspendAdminUser(authToken, id);
    if (res.success) {
      toast.success(res.message);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_suspended: res.data.is_suspended } : u,
        ),
      );
    } else {
      toast.error(res.message || "Action failed");
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteAdminUser(authToken, id);
    if (res.success) {
      toast.success(res.message);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeleteConfirmId(null);
    } else {
      toast.error(res.message || "Delete failed");
    }
  };

  return (
    <>
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-200"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="size-8" />
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">
            No users found.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="px-5 py-3 text-left">Name</th>
                    <th className="px-5 py-3 text-left">Email</th>
                    <th className="px-5 py-3 text-left">Mobile</th>
                    <th className="px-5 py-3 text-left">Role</th>
                    <th className="px-5 py-3 text-left">Status</th>
                    <th className="px-5 py-3 text-left">Registered</th>
                    <th className="px-5 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      <td className="px-5 py-3 font-medium text-gray-800">
                        {user.name}
                      </td>
                      <td className="px-5 py-3 text-gray-600">{user.email}</td>
                      <td className="px-5 py-3 text-gray-600">
                        {user.mobile || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <span className="capitalize text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                          {user.role}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            user.is_suspended
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.is_suspended ? "Suspended" : "Active"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {new Date(user.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-center gap-1">
                          {/* View */}
                          <button
                            onClick={() => handleView(user.id)}
                            title="View details"
                            className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Suspend / Unsuspend */}
                          {user.role !== "admin" && (
                            <button
                              onClick={() => handleSuspend(user.id)}
                              title={
                                user.is_suspended ? "Unsuspend" : "Suspend"
                              }
                              className={`p-1.5 rounded-lg transition-colors ${
                                user.is_suspended
                                  ? "text-green-600 hover:bg-green-50"
                                  : "text-yellow-500 hover:bg-yellow-50"
                              }`}
                            >
                              {user.is_suspended ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>
                          )}

                          {/* Delete */}
                          {user.role !== "admin" &&
                            (deleteConfirmId === user.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDelete(user.id)}
                                  className="text-xs px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(user.id)}
                                title="Delete user"
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {users.map((user) => (
                <div key={user.id} className="px-4 py-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
                        user.is_suspended
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.is_suspended ? "Suspended" : "Active"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Joined:{" "}
                    {new Date(user.created_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleView(user.id)}
                      className="flex-1 text-xs py-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      View
                    </button>
                    {user.role !== "admin" && (
                      <>
                        <button
                          onClick={() => handleSuspend(user.id)}
                          className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${
                            user.is_suspended
                              ? "border-green-200 text-green-600 hover:bg-green-50"
                              : "border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                          }`}
                        >
                          {user.is_suspended ? "Unsuspend" : "Suspend"}
                        </button>
                        {deleteConfirmId === user.id ? (
                          <div className="flex gap-1 flex-1">
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="flex-1 text-xs py-1.5 rounded-lg bg-red-500 text-white"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="flex-1 text-xs py-1.5 rounded-lg bg-gray-100 text-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(user.id)}
                            className="flex-1 text-xs py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 text-sm text-gray-500">
            <span>
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <div className="flex gap-2">
              {pagination.prev_page_url && (
                <button
                  onClick={() => fetchUsers(pagination.current_page - 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs"
                >
                  ← Prev
                </button>
              )}
              {pagination.next_page_url && (
                <button
                  onClick={() => fetchUsers(pagination.current_page + 1)}
                  className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-xs"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showModal && (
        <UserDetailModal
          user={selectedUser}
          loading={modalLoading}
          onClose={() => {
            setShowModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}
