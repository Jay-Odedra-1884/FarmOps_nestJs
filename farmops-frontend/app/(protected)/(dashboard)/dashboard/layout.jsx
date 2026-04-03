import React from "react";
import AddTransactionForm from "@/components/dashboard/AddTransactionForm";

function DashboardLayout({ children }) {
  return (
    <div className="h-full w-full grid grid-cols-12">
      {/* Mobile menu toggle placeholder */}
      <div className="md:hidden block absolute left-2 bg-green-500 p-2 rounded-lg mt-5">
      
      </div>

      {/* Add Transaction sidebar — visible on md+ */}
      <div className="col-span-2 hidden md:block">
        <AddTransactionForm />
      </div>

      {/* Main content area — each nested page renders here */}
      <div className="col-span-12 md:col-span-10 bg-gray-100 md:rounded-tl-4xl px-5 md:px-10 overflow-y-auto">
        {children}
        <div className="h-20"></div>
      </div>
    </div>
  );
}

export default DashboardLayout;
