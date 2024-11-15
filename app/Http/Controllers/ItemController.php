<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class ItemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $storeId = auth()->user()->store_id;
        $items = Item::where('store_id', $storeId)->get()->toArray();

        //return response()->json($stores);
        return Inertia::render('SellerInventory/Index', [
            'items' => $items,
        ]);
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
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'quantity' => 'nullable|integer|min:0',
            'type' => 'required|string',
            'state' => 'required|boolean',
            'image' => 'nullable|image|max:10000', // Optional image upload
            'store_id' => 'required|integer',
        ]);
    
        // Handle image upload
        $imagePath = $request->file('image')->storeAs('public/images/items', $request->file('image')->getClientOriginalName());
    
        // Save the item
        //Item::create($validated);
        $item = new Item();
        $item->name = $validated['name'];
        $item->description = $validated['description'];
        $item->price = $validated['price'];
        $item->quantity = $validated['quantity'];
        $item->type = $validated['type'];
        $item->state = $validated['state'];
        $item->image_path = str_replace('public', '', $imagePath); // Save relative path
        $item->store_id = auth()->user()->store_id;
        $item->save();
    
        //return response()->json(['message' => 'Item created successfully'], 201);
        return response()->json([
            'message' => 'Item added successfully!',
            'item' => $item,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Item $item)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Item $item)
    {
        //
    }


public function update(Request $request, Item $item)
{
    Log::info('Request data:', $request->all());
    // Validate the incoming data
    $request->validate([
        'name' => 'required|string|max:255',
        'description' => 'nullable|string|max:1000',
        'price' => 'required|numeric|min:0',
        'quantity' => 'nullable|integer|min:0',
        'type' => 'required|string|in:Meal,Drink,Snack,Others',
        'state' => 'required|boolean',
        'image' => 'nullable|image|mimes:jpg,jpeg,png|max:10000', // Ensure the image is valid
        'store_id' => 'required|integer',
    ]);

    // Check if there's a new image uploaded
    if ($request->hasFile('image')) {
        // Delete the old image if it exists
        if ($item->image_path && Storage::exists('public/storage' . $item->image_path)) {
            Storage::delete('public/storage' . $item->image_path);
        }

        // Store the new image
        $imagePath = $request->file('image')->store('images/items', 'public');
        $item->image_path = '/' . $imagePath; // Update the image path
    }

    // Update other fields
    $item->update([
        'name' => $request->name,
        'description' => $request->description,
        'price' => $request->price,
        'quantity' => $request->quantity,
        'type' => $request->type,
        'state' => $request->state,
        'store_id' => auth()->user()->store_id,
    ]);

    // Return a success response
    return response()->json(['message' => 'Item updated successfully!', 'item' => $item]);
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Item $item)
    {
        try {
            // The $item is automatically injected by Laravel through route model binding
            $item->delete();
    
            // Return success response
            return response()->json(['message' => 'Item deleted successfully'], 200);
        } catch (\Exception $e) {
            // Return error response if something goes wrong
            return response()->json(['message' => 'Error deleting item', 'error' => $e->getMessage()], 500);
        }
    }    
}
