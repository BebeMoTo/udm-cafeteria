<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'status',     // Pending, Accepted, Claimed, Cancelled
        'item_id',
        'total_price',
        'quantity',
        'store_id',
        'pending_time',   // Nullable
        'accepted_time',  // Nullable
        'claimed_time',   // Nullable
        'cancelled_time', // Nullable
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function item()
    {
        return $this->belongsTo(Item::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
