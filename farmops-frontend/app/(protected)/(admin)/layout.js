"use client";
import { MyHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({ children }) {
    const { authToken, authUser, authLoading } = MyHook();
    const router = useRouter();

    useEffect(() => {
        if (authLoading) return;

        if (!authToken) {
            router.push("/auth");
            return;
        }

        // authUser is loaded — only redirect non-admins away
        // If authUser is still null (stale session with old localStorage),
        // we stay and let the page render; the user must log out & back in.
        if (authUser !== null && authUser.role !== "admin") {
            router.push("/dashboard");
        }
    }, [authToken, authUser, authLoading]);

    if (authLoading) return null;

    // Not logged in at all
    if (!authToken) return null;

    // authUser loaded and is not admin → don't flash admin content
    if (authUser !== null && authUser.role !== "admin") return null;

    return (
        <div className="h-screen w-screen overflow-hidden">
            {children}
            <div className="h-20"></div>
        </div>
    );
}
