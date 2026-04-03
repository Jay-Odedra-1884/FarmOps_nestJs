<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Like;

class LikeToggled implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $listingId;
    public $count;

    public function __construct($listingId)
    {
        $this->listingId = $listingId;
        $this->count = Like::where('listing_id', $listingId)->count();
    }

    public function broadcastOn(): array
    {
        return [
            new Channel('listing.' . $this->listingId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'LikeToggled';
    }

    public function broadcastWith(): array
    {
        return [
            'count' => $this->count,
        ];
    }
}
