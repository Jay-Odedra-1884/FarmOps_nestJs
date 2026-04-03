import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import NavBar from "@/components/NavBar";
import { AppProvider } from "@/context/AppProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FarmOps",
  description: "FarmOps",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

        
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-screen overflow-hidden flex flex-col`}
      >
        <AppProvider>
          {/* NavBar — fixed top strip, never scrolls */}
          <NavBar />
          <Toaster />
          {/* Page content — fills all remaining height, each page controls its own scroll */}
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
