<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        // Validate the request
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'item_id' => 'required|exists:items,id',
            'store_id' => 'required|exists:stores,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:0',
        ]);

        // Retrieve user details
        $user = User::findOrFail($validated['user_id']);
        
        Log::info('User details:', $user->toArray()); // Convert the user object to an array for better readability

        // Log the user's balance
        Log::info('User Balance: ' . $user->balance);
        Log::info('Order Total Price: ' . $validated['total_price']);
        
        
        // Check if user balance is sufficient
        if ($user->balance < $validated['total_price']) {
            return response()->json([
                'message' => 'Insufficient balance.'
            ], 400);
        }
        
        // If balance is sufficient, reduce the balance and update expenses
        $user->balance -= $validated['total_price'];
        $user->expense += $validated['total_price'];
        $user->save();
        
    
        // Create the order without deducting the item stock
        $order = Order::create([
            'user_id' => $validated['user_id'],
            'item_id' => $validated['item_id'],
            'store_id' => $validated['store_id'],
            'quantity' => $validated['quantity'],
            'total_price' => $validated['total_price'],
            'status' => 'Pending', // Set the status to pending as seller confirmation is required
        ]);
    
        return response()->json([
            'message' => 'Order created successfully! Awaiting seller confirmation.',
            'order' => $order,
        ], 201);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
