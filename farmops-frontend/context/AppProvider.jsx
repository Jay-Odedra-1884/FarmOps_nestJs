"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const { createContext, useState, useEffect, useContext } = require("react");

const AppContext = createContext();
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to convert error object to string
const getErrorMessage = (message) => {
  if (typeof message === "string") {
    return message;
  }
  if (typeof message === "object" && message !== null) {
    const errors = [];
    for (const key in message) {
      if (Array.isArray(message[key])) {
        errors.push(message[key][0]);
      } else {
        errors.push(message[key]);
      }
    }
    return errors.join(", ") || "An error occurred";
  }
  return "An error occurred";
};

export const AppProvider = ({ children }) => {
  const router = useRouter();

  const [authToken, setAuthToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Targeted refresh signals ─────────────────────────────────────────────
  const [expenseVersion, setExpenseVersion] = useState(0);
  const [farmVersion, setFarmVersion] = useState(0);
  const [categoryVersion, setCategoryVersion] = useState(0);

  const notifyExpenseChange = () => setExpenseVersion((v) => v + 1);
  const notifyFarmChange = () => setFarmVersion((v) => v + 1);
  const notifyCategoryChange = () => setCategoryVersion((v) => v + 1);

  useEffect(() => {
    const token = Cookies.get("authToken");
    const storedUser = localStorage.getItem("authUser");
    if (token) {
      setAuthToken(token);
    }
    if (storedUser) {
      try {
        setAuthUser(JSON.parse(storedUser));
      } catch (_) {
        localStorage.removeItem("authUser");
      }
    }
    setAuthLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        Cookies.set("authToken", data.token);
        setAuthToken(data.token);

        // Persist user data (including role) for auth guards and role-based UI
        if (data.data) {
          setAuthUser(data.data);
          localStorage.setItem("authUser", JSON.stringify(data.data));
        }

        // Redirect based on role
        if (data.data?.role === "admin") {
          router.push("/admin-dashboard");
        } else {
          router.push("/dashboard");
        }
        toast.success("User Login !");
      } else {
        toast.error(getErrorMessage(data.message));
      }
      return data;
    } catch (error) {
      toast.error("login failed");
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (name, email, mobile, password, confirmPassword) => {
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          mobile,
          password,
          password_confirmation: confirmPassword,
        }),
      });

      const data = await res.json();
      if (data.success) {
        login(email, password);
      } else {
        toast.error(getErrorMessage(data.message));
      }
      return data;
    } catch (error) {
      toast.error("Registeration failed");
      console.error("Registeration failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch(`${API_URL}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        setAuthToken(null);
        setAuthUser(null);
        Cookies.remove("authToken");
        localStorage.removeItem("authUser");
        toast.success(data.message);
      } else {
        toast.error(getErrorMessage(data.message));
      }
      return data;
    } catch (error) {
      toast.error("logouFailed");
      console.error("Logout failed:", error);
      throw error;
    }
  };

  const forgotPassword = async (email) => {
    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(
          data.message || "Password reset link sent to your email!",
        );
      } else {
        toast.error(getErrorMessage(data.message));
      }
      return data;
    } catch (error) {
      toast.error("Failed to send reset link");
      console.error("Forgot password failed:", error);
      throw error;
    }
  };

  const resetPassword = async (
    token,
    email,
    password,
    passwordConfirmation,
  ) => {
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
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message || "Password reset successfully!");
      } else {
        toast.error(getErrorMessage(data.message));
      }
      return data;
    } catch (error) {
      toast.error("Failed to reset password");
      console.error("Reset password failed:", error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        login,
        register,
        logout,
        authToken,
        authUser,
        authLoading,
        forgotPassword,
        resetPassword,
        expenseVersion,
        notifyExpenseChange,
        farmVersion,
        notifyFarmChange,
        categoryVersion,
        notifyCategoryChange,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const MyHook = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("MyHook must be used within an AppProvider");
  }
  return context;
};
