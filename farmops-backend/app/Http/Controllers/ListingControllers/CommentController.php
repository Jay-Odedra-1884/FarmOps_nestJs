<?php

namespace App\Http\Controllers\ListingControllers;

use App\Events\CommentCreated;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class CommentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $comments = Comment::with(['user'])->where('listing_id', $request->query('listing_id'))->orderBy('created_at', 'desc')->paginate(5);
        return response()->json([
            'success' => true,
            'message' => 'Comments retrieved successfully',
            'data' => $comments]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        request()->validate([
            'listing_id' => 'required|integer|exists:listing,id',
            'content' => 'required|string',
        ]);

        $comment = Comment::create([
            'listing_id' => $request->get('listing_id'),
            'user_id' => auth()->user()->id,
            'content' => $request->get('content')
        ]);

        $comment->load('user');
        broadcast(new CommentCreated($comment));

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully',
            'data' => $comment
         ]);
    }

    /**
     * Display the specified resource.
     */
    //to display comment which is belongs to specific listing id
    public function show(string $id)
    {
        $comment = Comment::with(['user'])->find($id);
        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Comment retrieved successfully',
            'data' => $comment
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
        $comment = Comment::find($id);
        if(!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found',
            ], 404);
        }

        $request->validate([
            'content' => 'required|string'
        ]);
        $comment->update($request->only(['content']));
        return response()->json([
            'success' => true,
            'message' => 'Comment updated successfully',
            'data' => $comment
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $comment = Comment::find($id);
        if(!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Comment not found',
            ], 404);
        }
        $comment->delete();
        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully',
         ]);
    }
}
