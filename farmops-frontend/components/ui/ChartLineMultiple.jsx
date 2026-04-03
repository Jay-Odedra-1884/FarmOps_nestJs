"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

export const description = "A multiple line chart";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const chartConfig = {
  expense: {
    label: "Expenses",
    color: "#ef4444",
  },
  income: {
    label: "Income",
    color: "#22c55e",
  },
};

export function ChartLineMultiple({ data = [] }) {
  // Aggregate raw expense records into monthly { month, expense, income } buckets
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Build a map keyed by "YYYY-MM" for ordering, display as "Mon YYYY"
    const map = {};

    data.forEach((record) => {
      const date = new Date(record.expense_date || record.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      if (!map[key]) {
        map[key] = {
          month: `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`,
          expense: 0,
          income: 0,
          _key: key,
        };
      }
      if (record.type === "expense") {
        map[key].expense += parseFloat(record.amount);
      } else if (record.type === "income") {
        map[key].income += parseFloat(record.amount);
      }
    });

    // Sort chronologically and round to 2 dp
    return Object.values(map)
      .sort((a, b) => a._key.localeCompare(b._key))
      .map(({ _key, ...rest }) => ({
        ...rest,
        expense: parseFloat(rest.expense.toFixed(2)),
        income: parseFloat(rest.income.toFixed(2)),
      }));
  }, [data]);

  // Compute totals for the footer trend indicator
  const totalIncome = useMemo(
    () => chartData.reduce((s, d) => s + d.income, 0),
    [chartData],
  );
  const totalExpense = useMemo(
    () => chartData.reduce((s, d) => s + d.expense, 0),
    [chartData],
  );
  const profit = totalIncome - totalExpense;
  const isProfitable = profit >= 0;

  const dateRange =
    chartData.length > 0
      ? `${chartData[0].month} — ${chartData[chartData.length - 1].month}`
      : "No data yet";

  return (
    <Card className="bg-transparent border-none shadow-none h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-800">Expenses vs Income</CardTitle>
        <CardDescription className="text-gray-500">{dateRange}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-sm">
            No transaction data available
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-full w-full min-h-[200px]"
          >
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#e5e7eb"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 12, fill: "#9ca3af" }}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                tickFormatter={(v) =>
                  `₹${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`
                }
              />
              <ChartTooltip
                cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                content={
                  <ChartTooltipContent
                    formatter={(value) =>
                      `₹${Number(value).toLocaleString("en-IN")}`
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                dataKey="expense"
                type="monotone"
                stroke={chartConfig.expense.color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: chartConfig.expense.color }}
                activeDot={{ r: 5 }}
              />
              <Line
                dataKey="income"
                type="monotone"
                stroke={chartConfig.income.color}
                strokeWidth={2.5}
                dot={{ r: 3, fill: chartConfig.income.color }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex w-full items-center gap-2 text-sm">
          {isProfitable ? (
            <TrendingUp className="h-4 w-4 text-green-500 shrink-0" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500 shrink-0" />
          )}
          <span
            className={`font-medium ${isProfitable ? "text-green-600" : "text-red-600"}`}
          >
            Net {isProfitable ? "Profit" : "Loss"}: ₹
            {Math.abs(profit).toLocaleString("en-IN")}
          </span>
          <span className="text-muted-foreground ml-auto">
            {chartData.length} month(s) of data
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
