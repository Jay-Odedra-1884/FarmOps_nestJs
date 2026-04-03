<?php

namespace App\Http\Controllers\ListingControllers;

use App\Jobs\ImportCsvJob;
use App\Models\Listing;
use Exception;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Storage;

class ListingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $listings = Listing::with(['category', 'user'])->paginate(20);
        return response()->json([
            'success' => true,
            'message' => 'Listing retrieved successfully',
            'data' => $listings
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_id' => 'required|integer|exists:category,id',
        ]);

        try {
            $imagePath = $request->file('image') ? $request->file('image')->store('images', 'public') : null;
            $listing = Listing::create([
                'title' => $request->title,
                'description' => $request->description,
                'image' => $imagePath,
                'category_id' => $request->category_id,
                'user_id' => auth()->user()->id,
            ]);
            return response()->json([
                'success' => true,
                'message' => 'Listing created successfully',
                'data' => $listing
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create listing: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function userListings() {
        $listings = Listing::where('user_id', auth()->user()->id)->with(['category', 'user'])->paginate(20);
        return response()->json([
            'success' => true,
            'message' => 'User listings retrieved successfully',
            'data' => $listings,
            'id' => auth()->user()->id
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Listing::with(['category', 'user'])->withCount('likes')->find($id);
        if (!$data) {
            return response()->json([
                'success' => false,
                'message' => 'Listing not found',
            ], 404);
        }

        $data['liked'] = $data->likes()->where('user_id', auth()->user()->id)->exists();

        return response()->json([
            'success' => true,
            'message' => 'Listing retrieved successfully',
            'data' => $data
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'category_id' => 'required|integer|exists:category,id',
        ]);

        try {
            $listing = Listing::find($id);
            if (!$listing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Listing not found',
                ], 404);
            }

            if ($request->hasFile('image')) {
                // Store new image on the public disk
                $imagePath = $request->file('image')->store('images', 'public');

                // Delete old image from the public disk
                if ($listing->image && Storage::disk('public')->exists($listing->image)) {
                    Storage::disk('public')->delete($listing->image);
                }
            }

            $listing->update([
                'title' => $request->title ?? $listing->title,
                'description' => $request->description ?? $listing->description,
                'image' => $imagePath ?? $listing->image,
                'category_id' => $request->category_id ?? $listing->category_id,
                'user_id' => auth()->user()->id,
            ]);




            return response()->json([
                'success' => true,
                'message' => 'Listing updated successfully',
                'data' => $listing
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update listing: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $listing = Listing::find($id);
            if (!$listing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Listing not found',
                ], 404);
            }

            // Delete image from the public disk
            if ($listing->image && Storage::disk('public')->exists($listing->image)) {
                Storage::disk('public')->delete($listing->image);
            }

            $listing->delete();

            return response()->json([
                'success' => true,
                'message' => 'Listing deleted successfully',
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete listing: ' . $e->getMessage(),
            ], 500);
        }
    }


    //function to upload the listing using the csv file 
    public function upload(Request $request) {
        $request->validate([
            'file'  => 'required|file|mimes:csv,txt'
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads', 'public');
        $absolutePath = storage_path('app/public/' . $path);

        //Dishpatch the job to the queue
        ImportCsvJob::dispatch($absolutePath, auth()->user()->id);

        return response()->json([
                'success' => true,
                'message' => 'Listings uploaded successfully',
            ]);
    }
}
