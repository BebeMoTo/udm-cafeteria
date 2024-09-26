<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'stall_no',
        'name',
        'balance',
        'description',
        'state',        // 1 if open, 0 if closed
        'additional_fee',
    ];
    protected $hidden = ['created_at', 'updated_at'];


    
    public function items() {
        return $this->hasMany(Item::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function transactions() {
        return $this->hasMany(Transaction::class);
    }

    public function users() {
        return $this->hasMany(User::class);
    }
    
}
