<?php

namespace App\Http\Controllers;

use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StoreController extends Controller
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


        $stores = Store::all(); // Fetch all stores

        //return response()->json($stores);
        return Inertia::render('Stores/Index', [
            'stores' => $stores,
        ]);
    }

    // public function sellerOption()
    // {
    //     $stores = Store::all(); // Fetch all stores

    //     //return response()->json($stores);
    //     return Inertia::render('AdminUsers/Create', [
    //         'stores' => $stores,
    //     ]); 
    // }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Store $store)
    {
        $store->load('items'); // Assuming 'items' is the relationship name in your Store model

        return Inertia::render('Stores/Show', [
            'store' => $store->only('id', 'name', 'description', 'stall_no', 'state', 'additional_fee'),
            'items' => $store->items, // Pass the items related to the store
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Store $store)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Store $store)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        //
    }
}
