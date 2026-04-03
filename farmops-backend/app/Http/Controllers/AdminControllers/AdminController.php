<?php

namespace App\Http\Controllers\AdminControllers;

use App\Models\User;
use App\Models\Farm;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AdminController extends Controller
{
    /**
     * Get paginated list of all users with optional search and status filters.
     */
    public function getUsers(Request $request)
    {
        $query = User::query()->select('id', 'name', 'email', 'mobile', 'role', 'is_suspended', 'created_at');

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by status: active | suspended
        if ($request->filled('status')) {
            if ($request->status === 'suspended') {
                $query->where('is_suspended', true);
            } elseif ($request->status === 'active') {
                $query->where('is_suspended', false);
            }
        }

        $users = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Get a single user with their summary stats.
     */
    public function getUser($id)
    {
        $user = User::select('id', 'name', 'email', 'mobile', 'role', 'is_suspended', 'created_at')
            ->withCount('farms')
            ->findOrFail($id);

        $totalExpenses = Expense::where('user_id', $id)->where('type', 'expense')->sum('amount');
        $totalIncome = Expense::where('user_id', $id)->where('type', 'income')->sum('amount');

        return response()->json([
            'success' => true,
            'data' => array_merge($user->toArray(), [
                'total_expenses' => round($totalExpenses, 2),
                'total_income' => round($totalIncome, 2),
            ]),
        ]);
    }

    /**
     * Toggle the suspended status of a user.
     */
    public function suspendUser($id)
    {
        $user = User::findOrFail($id);

        // Prevent suspending another admin
        if ($user->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot suspend an admin user.',
            ], 403);
        }

        $user->is_suspended = !$user->is_suspended;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => $user->is_suspended ? 'User suspended.' : 'User unsuspended.',
            'data' => [
                'id' => $user->id,
                'is_suspended' => $user->is_suspended,
            ],
        ]);
    }

    /**
     * Hard-delete a user (cascades to their data via FK constraints).
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting another admin
        if ($user->role === 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete an admin user.',
            ], 403);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully.',
        ]);
    }

    /**
     * Return platform-wide statistics for the admin dashboard.
     */
    public function platformStats()
    {
        $totalUsers = User::where('role', '!=', 'admin')->count();
        $suspendedUsers = User::where('is_suspended', true)->count();
        $totalFarms = Farm::count();
        $totalExpenses = Expense::where('type', 'expense')->sum('amount');
        $totalIncome = Expense::where('type', 'income')->sum('amount');

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'suspended_users' => $suspendedUsers,
                'total_farms' => $totalFarms,
                'total_expenses' => round($totalExpenses, 2),
                'total_income' => round($totalIncome, 2),
            ],
        ]);
    }
}
