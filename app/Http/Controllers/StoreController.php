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
        $user = auth()->user();

        if ($user->type !== 'Seller') {
            $stores = Store::all(); // Fetch all stores

            //return response()->json($stores);
            return Inertia::render('Stores/Index', [
                'stores' => $stores,
            ]);
        }
        else{
            $store = Store::find($user->store_id);

            if (!$store) {
                // If the seller has no associated store
                abort(404, 'Store not found');
            }
        
            return Inertia::render('SellerStore/Index', [
                'store' => $store->only(['id', 'name', 'description', 'stall_no', 'state', 'additional_fee', 'balance']),
            ]);
        }

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
        // Validate the form data
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:stores,name',
            'description' => 'required|string|max:255',
            'stallNo' => 'required|integer|unique:stores,stall_no',
            'additionalFee' => 'required|numeric|min:0',
            'balance' => 'required|numeric|min:0',
        ], [
            'name.unique' => 'The store name is already in use. Please choose a different name.',
            'stallNo.unique' => 'The stall number is already in use. Please choose a stall.',
        ]);

        $store = Store::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'stall_no' => $validated['stallNo'],
            'additional_fee' => $validated['additionalFee'],
            'balance' => $validated['balance'],
            ]);

        // Redirect with a success message
        return redirect()->back()->with('success', 'Store created successfully');
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
        // Validate the incoming data
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:stores,name,' . $store->id,
            'description' => 'required|string|max:255',
            'state' => 'required|numeric', // Assuming state is either 'open' or 'closed'
            'additional_fee' => 'required|numeric|min:0',
        ]);
    
        // Update the store with validated data
        $store->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'state' => $validated['state'],
            'additional_fee' => $validated['additional_fee'],
        ]);
    
        // Redirect back with success message
        //return redirect()->route('store.index')->with('success', 'Store information updated successfully.');
        return response()->json(['message' => 'Store updated successfully!', 'store' => $store]);
    }
    

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Store $store)
    {
        //
    }
}
