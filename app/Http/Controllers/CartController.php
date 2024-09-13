<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //Redirect to dashboard if seller
        if (auth()->user()->type === 'Seller') {
            return Inertia::render('Dashboard'); // Redirect to a different route or page
        }
        // Get the current authenticated user's ID
        $userId = auth()->id();

        // Fetch cart items for the authenticated user
        $carts = Cart::with([
                'item' => function($query) {
                    $query->select('id', 'name', 'price', 'quantity', 'state', 'image_path'); // Specify the columns you want to include
                },
                'store' => function($query) {
                    $query->select('id', 'name', 'state', 'additional_fee'); // Specify columns for the store if needed
                }
            ])
                     ->where('user_id', $userId)
                     ->get();

        // Pass the data to the Inertia view
        return Inertia::render('Carts/Index', [
            'carts' => $carts
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Carts/Create'); // No additional data to pass
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric',
            'store_id' => 'required|exists:stores,id',
        ]);

        Cart::create($validated); // Save the new cart item
        return redirect()->route('carts.index'); // Redirect to the index page
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        return Inertia::render('Carts/Show', [
            'cart' => $cart,
        ]); // Pass the data to the React component
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Cart $cart)
    {
        return Inertia::render('Carts/Edit', [
            'cart' => $cart,
        ]); // Pass the data to the React component
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cart $cart)
    {
        $validated = $request->validate([
            'item_id' => 'required|exists:items,id',
            'quantity' => 'required|integer|min:1',
            'total_price' => 'required|numeric',
            'store_id' => 'required|exists:stores,id',
        ]);

        $cart->update($validated); // Update the cart item
        return redirect()->route('carts.index'); // Redirect to the index page
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart)
    {
        $cart->delete();
    
        return response()->json(['message' => 'Cart item deleted successfully']);
    }
    
}
