<?php

namespace App\Http\Controllers\DashboardControllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class StatsController extends Controller
{

    private function formatAmount($amount)
    {
        return ($amount == floor($amount)) ? (int) $amount : round($amount, 2);
    }

    public function getUserStats()
    {
        $expenses = Expense::where('type', 'expense')->where('user_id', auth()->user()->id)->sum('amount');
        $income = Expense::where('type', 'income')->where('user_id', auth()->user()->id)->sum('amount');
        $profit = $income - $expenses;
        return response()->json([
            'success' => true,
            'data' => [
                'expenses' => $this->formatAmount($expenses),
                'income' => $this->formatAmount($income),
                'profit' => $this->formatAmount($profit),
            ]
        ]);
    }

    public function getFarmStats($id)
    {
        $expenses = Expense::where('type', 'expense')->where('user_id', auth()->user()->id)->where('farm_id', $id)->sum('amount');
        $income = Expense::where('type', 'income')->where('user_id', auth()->user()->id)->where('farm_id', $id)->sum('amount');
        $profit = $income - $expenses;
        return response()->json([
            'success' => true,
            'data' => [
                'expenses' => $this->formatAmount($expenses),
                'income' => $this->formatAmount($income),
                'profit' => $this->formatAmount($profit),
            ]
        ]);
    }
}
