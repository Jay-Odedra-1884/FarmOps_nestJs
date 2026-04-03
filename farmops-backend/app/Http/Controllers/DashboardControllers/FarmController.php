<?php

namespace App\Http\Controllers\DashboardControllers;

use App\Models\Farm;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class FarmController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $farms = Farm::where('user_id', auth()->user()->id)->get();
        return response()->json([
            'success' => true,
            'message' => 'Farms retrieved successfully',
            'data' => $farms
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:30',
            'location' => 'nullable|string|max:20',
            'size' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ]);
        }

        $data = $validator->validate();
        $farm = Farm::create([
            'name' => $data['name'],
            'location' => $data['location'] ?? null,
            'size' => $data['size'] ?? null,
            'user_id' => auth()->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Farm created successfully',
            'data' => $farm
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $farm = Farm::where('id', $id)->where('user_id', auth()->user()->id)->first();
        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found'
            ]);
        }
        return response()->json([
            'success' => true,
            'message' => 'Farm retrieved successfully',
            'data' => $farm
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $farm = Farm::where('id', $id)->where('user_id', auth()->user()->id)->first();
        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found'
            ]);
        }
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:30',
            'location' => 'string|max:20',
            'size' => 'numeric',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'data' => $validator->errors()
            ]);
        }

        $data = $validator->validate();
        $farm->update([
            'name' => $data['name'],
            'location' => $data['location'] ?? null,
            'size' => $data['size'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Farm updated successfully',
            'data' => $farm
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $farm = Farm::where('id', $id)->where('user_id', auth()->user()->id)->first();
        if (!$farm) {
            return response()->json([
                'success' => false,
                'message' => 'Farm not found'
            ]);
        }
        $farm->delete();
        return response()->json([
            'success' => true,
            'message' => 'Farm deleted successfully'
        ]);
    }
}
