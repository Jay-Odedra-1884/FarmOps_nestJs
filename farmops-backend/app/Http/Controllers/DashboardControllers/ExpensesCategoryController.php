<?php

namespace App\Http\Controllers\DashboardControllers;

use App\Models\ExpensesCategory;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;


class ExpensesCategoryController extends Controller
{
    /**
     * Return global (user_id = null) + authenticated user's own categories.
     */
    public function index()
    {
        $categories = ExpensesCategory::where('user_id', auth()->user()->id)->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'message' => 'Expenses Categories Fetched Successfully',
            'data' => $categories
        ]);
    }

    /**
     * Store a user-created custom category.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ]);
        }

        $category = ExpensesCategory::create([
            'name' => $request->name,
            'user_id' => auth()->user()->id, // always tied to the authenticated user
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Category Created Successfully',
            'data' => $category
        ]);
    }

    /**
     * Delete a category — only user's own custom categories can be deleted.
     */
    public function destroy($id)
    {
        $category = ExpensesCategory::find($id);

        if (!$category) {
            return response()->json(['success' => false, 'message' => 'Category not found'], 404);
        }

        // Prevent deleting global/default categories
        if (is_null($category->user_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Default categories cannot be deleted'
            ], 403);
        }

        // Prevent deleting another user's category
        if ($category->user_id !== auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $category->delete();

        return response()->json([
            'success' => true,
            'message' => 'Category Deleted Successfully',
            'data' => $category
        ]);
    }
}
