"use client"
import { MyHook } from "@/context/AppProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }) {

    const { authToken, authLoading } = MyHook();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !authToken) {
            router.push('/auth');
        }
    }, [authToken, authLoading]);

    // Don't render anything while checking the cookie
    if (authLoading) return null;

    return (
        <div className="h-screen w-screen overflow-auto">
            {children}
            <div className="h-20"></div>
        </div>
    );
}