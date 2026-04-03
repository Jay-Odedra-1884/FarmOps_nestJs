<?php

namespace App\Http\Controllers\ListingControllers;

use App\Events\LikeToggled;
use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class LikeController extends Controller
{
   public function toggle(Request $request) {
    $validator = Validator::make($request->all(), [
        'listing_id' => 'required|exists:listing,id',
    ]);
    if($validator->fails()) {
        return response()->json([
            'status' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ]);
    }

    $like = Like::where('user_id', auth()->user()->id)
        ->where('listing_id', $request->listing_id)
        ->first();

    if ($like) {
        $like->delete();
        $event = new LikeToggled($request->listing_id);
        broadcast($event);
        return response()->json([
            'status' => true,
            'liked'=>false,
            'message' => 'Unlike',
            'count' => $event->count,
        ]);
    } else {
        Like::create([
            'user_id' => auth()->id(),
            'listing_id' => $request->listing_id,
        ]);

        $event = new LikeToggled($request->listing_id);
        broadcast($event);
        return response()->json([
            'status' => true,
            'liked'=>true,
            'message' => 'Like',
            'count' => $event->count,
        ]);
    }
   }
}
