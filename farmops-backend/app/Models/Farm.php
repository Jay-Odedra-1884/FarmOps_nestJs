<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Crop;
use App\Models\Expense;

class Farm extends Model
{
    protected $fillable = [
        'name',
        'location',
        'size',
        'user_id'
    ];

    /**
     * Cascade delete expenses and crops when a farm is deleted.
     * Expenses must be deleted BEFORE crops because expenses have a
     * foreign key on crop_id — deleting crops first would fail.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($farm) {
            // 1. Delete all expenses tied to this farm first
            $farm->expense()->delete();
            // 2. Then delete all crops (expenses referencing them are already gone)
            $farm->crop()->delete();
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function crop()
    {
        return $this->hasMany(Crop::class);
    }

    public function expense()
    {
        return $this->hasMany(Expense::class);
    }
}
