"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";
import toast from "react-hot-toast";

// Inner component that reads search params (must be wrapped in Suspense)
function ResetPasswordForm() {
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!token || !email) {
      setError("Invalid reset link");
      toast.error("Invalid reset link");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setPassword("");
        setConfirmPassword("");
        toast.success(data.message || "Password reset successfully!");
        setTimeout(() => {
          router.push("/auth");
        }, 2000);
      } else {
        setError(data.message || "Failed to reset password");
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Reset password failed:", error);
      setError("Failed to reset password. Please try again.");
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col gap-5 justify-center items-center p-6">
        <div className="w-full max-w-md flex flex-col justify-center items-center gap-2 bg-white py-12 px-10 rounded-3xl shadow-2xl">
          <h2 className="mb-8 font-bold text-4xl text-gray-800 text-center">
            Invalid Link
          </h2>
          <p className="text-gray-600 text-center mb-6">
            This password reset link is invalid or has expired.
          </p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-lg font-medium cursor-pointer py-4 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Request a New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col gap-5 justify-center items-center p-6">
      <div className="w-full max-w-md flex flex-col justify-center items-center gap-2 bg-white py-12 px-10 rounded-3xl shadow-2xl">
        <h2 className="mb-8 font-bold text-4xl text-gray-800">
          Reset Password
        </h2>

        <p className="text-gray-600 text-center mb-6">
          Enter your new password below.
        </p>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {success && (
          <div className="w-full mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-600 text-sm text-center">
              Password reset successfully! Redirecting to login...
            </p>
          </div>
        )}

        {!success ? (
          <form
            onSubmit={handleResetPasswordSubmit}
            className="w-full flex flex-col gap-5 items-center"
          >
            <input
              className="w-full bg-gray-100 rounded-xl px-5 py-4 text-base outline-none border-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400 text-gray-800"
              placeholder="New Password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <input
              className="w-full bg-gray-100 rounded-xl px-5 py-4 text-base outline-none border-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder-gray-400 text-gray-800"
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-lg font-medium cursor-pointer py-4 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        ) : (
          <button
            onClick={() => router.push("/auth")}
            className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl text-white text-lg font-medium cursor-pointer py-4 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Back to Login
          </button>
        )}
      </div>
    </div>
  );
}

// Next.js 15: useSearchParams() must be wrapped in <Suspense>
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
