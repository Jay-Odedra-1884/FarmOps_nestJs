"use client";

import { MyHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function NavBar() {
  const { authToken, authUser, logout } = MyHook();
  const [mobileView, setMobileView] = useState(true);
  const router = useRouter();

  const isAdmin = authUser?.role === "admin";

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="bg-transparent text-black xl:px-5 w-full flex justify-between items-center scale-80 md:scale-100">
      <div className="text-3xl py-4">FarmOps</div>
      <div className="md:hidden block z-10">
        <div
          onClick={() => setMobileView(!mobileView)}
          className="flex gap-5 items-center font-bold bg-black text-white px-4 py-2 rounded-lg"
        >
          Menu
        </div>
        {mobileView && (
          <div className="absolute right-0 flex-col gap-5 items-center mt-1 text-xl font-bold bg-black text-white px-4 py-2 rounded-lg">
            <div
              onClick={() => router.push("/")}
              className="cursor-pointer hover:scale-110"
            >
              Home
            </div>
            {authToken && (
              <>
                <div
                  onClick={() => router.push("/listings")}
                  className="cursor-pointer hover:scale-110"
                >
                  Read
                </div>
                <div
                  onClick={() => router.push("/my-space")}
                  className="cursor-pointer hover:scale-110"
                >
                  My Space
                </div>
                <div
                  onClick={() => router.push("/dashboard")}
                  className="cursor-pointer text-green-500 hover:scale-110"
                >
                  Dashboard
                </div>
                {isAdmin && (
                  <div
                    onClick={() => router.push("/admin-dashboard")}
                    className="cursor-pointer text-yellow-400 hover:scale-110"
                  >
                    Admin Panel
                  </div>
                )}
              </>
            )}
            {authToken ? (
              <div
                className="cursor-pointer hover:scale-110"
                onClick={handleLogout}
              >
                Logout
              </div>
            ) : (
              <div
                onClick={() => router.push("/auth")}
                className="cursor-pointer hover:scale-110"
              >
                Login
              </div>
            )}
          </div>
        )}
      </div>
      <div className="hidden md:flex gap-5 items-center font-bold bg-black text-white px-4 py-2 rounded-lg">
        <div
          onClick={() => router.push("/")}
          className="cursor-pointer hover:scale-110"
        >
          Home
        </div>
        {authToken && (
          <>
            <div
              onClick={() => router.push("/listings")}
              className="cursor-pointer hover:scale-110"
            >
              Read
            </div>
            <div
              onClick={() => router.push("/my-space")}
              className="cursor-pointer hover:scale-110"
            >
              My Space
            </div>
            <div
              onClick={() => router.push("/dashboard")}
              className="cursor-pointer text-green-500 hover:scale-110"
            >
              Dashboard
            </div>
            {isAdmin && (
              <div
                onClick={() => router.push("/admin-dashboard")}
                className="cursor-pointer text-yellow-400 hover:scale-110"
              >
                Admin Panel
              </div>
            )}
          </>
        )}
        {authToken ? (
          <div
            className="cursor-pointer hover:scale-110"
            onClick={handleLogout}
          >
            Logout
          </div>
        ) : (
          <div
            onClick={() => router.push("/auth")}
            className="cursor-pointer hover:scale-110"
          >
            Login
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
