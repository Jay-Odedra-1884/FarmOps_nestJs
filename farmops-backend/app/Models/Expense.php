<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expense extends Model
{
    protected $fillable = [
        "note",
        "amount",
        "type",
        "category_id",
        "crop_id",
        "farm_id",
        "user_id",
        "expense_date",
    ];

    public function category()
    {
        return $this->belongsTo(ExpensesCategory::class);
    }

    public function crop()
    {
        return $this->belongsTo(Crop::class);
    }

    public function farm()
    {
        return $this->belongsTo(Farm::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
