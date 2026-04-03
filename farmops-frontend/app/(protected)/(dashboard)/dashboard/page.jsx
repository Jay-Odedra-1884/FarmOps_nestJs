"use client";

import React, { useEffect, useState } from "react";
import { ChartLineMultiple } from "@/components/ui/ChartLineMultiple";
import FarmsList from "@/components/dashboard/FarmsList";
import ExpenseList from "@/components/dashboard/ExpenseList";
import { MyHook } from "@/context/AppProvider";
import { getUserStats } from "@/services/statsApi";
import { Spinner } from "@/components/ui/spinner";
import { getAllExpenses } from "@/services/expenseApi";

function page() {
  const { authToken, expenseVersion, notifyExpenseChange, notifyFarmChange } =
    MyHook();
  const [stats, setStats] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [expensesLoading, setExpensesLoading] = useState(false);

  // dataVersion from context changes whenever ANY component calls notifyDataChange()
  // (AddTransactionForm sidebar, FarmsList add/delete, etc.)

  useEffect(() => {
    if (authToken) {
      // Re-fetch stats and chart data whenever a child mutates data
      setStatsLoading(true);
      getUserStats(authToken)
        .then((res) => {
          setStats(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setStatsLoading(false);
        });

      setExpensesLoading(true);
      getAllExpenses(authToken)
        .then((res) => {
          setExpenses(res.data);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setExpensesLoading(false);
        });
    }
  }, [authToken, expenseVersion]);

  return (
    <div className="space-y-6">
      {/* top info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 py-10">
        <div className="w-full h-28 text-black bg-white shadow-lg border border-white/20 rounded-2xl flex flex-col justify-center items-center">
          <p className="text-xl font-semibold">Expenses</p>
          <p className="text-red-500 text-xl font-semibold">
            {statsLoading ? (
              <Spinner className="size-8" />
            ) : (
              "₹" + stats.expenses
            )}
          </p>
        </div>
        <div className="w-full h-28 text-black bg-white shadow-lg border border-white/20 rounded-2xl flex flex-col justify-center items-center">
          <p className="text-xl font-semibold">Income</p>
          <p className="text-green-500 text-xl font-semibold">
            {statsLoading ? <Spinner className="size-8" /> : "₹" + stats.income}
          </p>
        </div>
        <div className="w-full h-28 text-black bg-white shadow-lg border border-white/20 rounded-2xl flex flex-col justify-center items-center">
          <p className="text-xl font-semibold">Profit</p>
          <p
            className={`text-xl font-semibold ${stats.profit < 0 ? "text-red-500" : "text-green-500"}`}
          >
            {statsLoading ? (
              <Spinner className="size-8 text-blue-500" />
            ) : (
              "₹" + stats.profit
            )}
          </p>
        </div>
      </div>

      {/* farms list + chart */}
      <div className="xl:h-[600px] grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="overflow-auto">
          <FarmsList onDataChange={notifyFarmChange} />
        </div>
        {/* expenses chart */}
        <div className="h-full bg-white rounded-2xl p-5">
          <ChartLineMultiple data={expenses.data} />
        </div>
      </div>

      {/* all transactions list */}
      <ExpenseList
        showFarm={true}
        title="All Transactions"
        onDataChange={notifyExpenseChange}
      />
    </div>
  );
}

export default page;
