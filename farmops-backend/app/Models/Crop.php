<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Farm;
use App\Models\Expense;

class Crop extends Model
{
    protected $fillable = [
        'name',
        'farm_id'
    ];

    /**
     * Cascade-delete all related expenses when a crop is deleted.
     * This works at the application level as a safety net alongside
     * the ON DELETE CASCADE foreign key set in the migration.
     */
    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($crop) {
            $crop->expenses()->delete();
        });
    }

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function expenses()
    {
        return $this->hasMany(Expense::class);
    }
}
