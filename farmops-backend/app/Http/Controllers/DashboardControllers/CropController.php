<?php

namespace App\Http\Controllers\DashboardControllers;

use App\Models\Crop;
use GrahamCampbell\ResultType\Success;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class CropController extends Controller
{

    public function index(Request $request)
    {
        $crop = Crop::where('farm_id', $request->farm_id)->orderBy('created_at', 'desc')->get();
        return response()->json([
            'success' => true,
            'message' => 'Crop retrieved successfully',
            'data' => $crop,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'farm_id' => 'required|exists:farms,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ]);
        }

        $crop = Crop::create([
            'name' => $request->name,
            'farm_id' => $request->farm_id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Crop created successfully',
            'data' => $crop,
        ]);
    }


    public function show(Request $request, $id)
    {
        $crop = Crop::where('farm_id', $request->farm_id)->find($id);
        return response()->json([
            'success' => true,
            'message' => 'Crop retrieved successfully from show',
            'data' => $crop,
        ]);
    }

    public function edit(Crop $crop)
    {
        //
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
            ]);
        }

        $crop = Crop::find($id);
        $crop->update([
            'name' => $request->name,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Crop updated successfully',
            'data' => $crop,
        ]);
    }

  
    public function destroy($id)
    {
        $crop = Crop::find($id);
        $crop->delete();
        return response()->json([
            'success' => true,
            'message' => 'Crop deleted successfully',
        ]);
    }
}
