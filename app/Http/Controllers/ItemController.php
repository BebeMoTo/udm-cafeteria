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
        $item->store_id = $validated['store_id'];
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

    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, Item $item)
    // {
    //     // Validate the form data (including image if provided)
    //     $validatedData = $request->validate([
    //         'name' => 'required|string|max:255',
    //         'description' => 'nullable|string',
    //         'price' => 'nullable|numeric',
    //         'quantity' => 'nullable|integer',
    //         'state' => 'nullable|boolean',
    //         'type' => 'nullable|string',
    //         'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10048', 
    //     ]);

    
    //     // Check if there's an image file to upload
    //     if ($request->hasFile('image')) {
    //         $imagePath = $request->file('image')->store('images/items', 'public'); // Store image in public storage
    //         $validatedData['image_path'] = $imagePath;
    //     }
    
    //     // Update item with validated data
    //     $item->update($validatedData);
    
    //     return response()->json([
    //         'message' => 'Item updated successfully.',
    //         'data' => $validatedData, // Send validated data back
    //         'request' => $request->all(), // You can also send the whole request data for debugging
    //     ]);
    // }
    public function update(Request $request, Item $item)
{
    Log::info('Request data:', $request->all());
    // Initialize an array to store the updated fields
    $updatedData = [];
    // Validate and update the 'name' field
    if ($request->has('name')) {
        Log::info('Name:', ['name' => $request->input('name')]);
        $request->validate([
            'name' => 'required|string|max:255', // Validate 'name'
        ]);
        $updatedData['name'] = $request->input('name'); // Update 'name' field if it's present in the request
    }

    // Validate and update the 'description' field (optional)
    if ($request->has('description')) {
        $request->validate([
            'description' => 'required|string', // Validate 'description'
        ]);
        $updatedData['description'] = $request->input('description'); // Update 'description' if present
    }

    // Validate and update the 'price' field (optional)
    if ($request->has('price')) {
        $request->validate([
            'price' => 'required|numeric', // Validate 'price'
        ]);
        $updatedData['price'] = $request->input('price'); // Update 'price' if present
    }

    // Validate and update the 'quantity' field (optional)
    if ($request->has('quantity')) {
        $request->validate([
            'quantity' => 'required|integer', // Validate 'quantity'
        ]);
        $updatedData['quantity'] = $request->input('quantity'); // Update 'quantity' if present
    }

    // Validate and update the 'state' field (optional)
    if ($request->has('state')) {
        $request->validate([
            'state' => 'required|boolean', // Validate 'state'
        ]);
        $updatedData['state'] = $request->input('state'); // Update 'state' if present
    }

    // Validate and update the 'type' field (optional)
    if ($request->has('type')) {
        $request->validate([
            'type' => 'required|string', // Validate 'type'
        ]);
        $updatedData['type'] = $request->input('type'); // Update 'type' if present
    }

    /*
    // Check if there's an image file to upload (optional)
    // Handle the image upload if a new file is provided
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('images/items', 'public');
        $updatedData['image_path'] = $imagePath;
    } elseif ($request->input('image_path')) {
        // Use existing image path if no new file is uploaded
        $updatedData['image_path'] = $request->input('image_path');
    }
    */
    // Update item with the validated data (only the fields that were present and validated)
    $item->update($updatedData);

    // Return response
    return response()->json([
        'message' => 'Item updated successfully.',
        'data' => $updatedData, // Return the updated data to confirm the changes
        'request' => $request->all(), // Send the entire request data for debugging purposes
    ]);
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
